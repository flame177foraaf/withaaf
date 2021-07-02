var express = require('express');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());
var app = express();
var url = require('url');

const client = require('../config/dbconfig.js');

router.get('/', async function(req,res,next) {
  var QueryString = 'select item_name from aquafeq.aquafitem ORDER BY item_name collate "ko_KR.utf8";'
  await client.query(QueryString, async function (err, response){
    await response;
    console.log(response.rows[0]);
    if (err) {
      res.redirect('/');
    } else {
      res.render('item', {
        title:'AAF 아이템',
        data: response.rows
      });
    };
  });
});


router.get('/add_item', async function(req,res,next) {

  res.render ('additem', {
    title:'AAF 아이템 추가'
  });
});


//무기 추가하기
router.post('/add_item', async function(req,res,next) {

  var Itemname = req.body.name;

  var Itemtext = req.body.text;
    if (Itemtext == '') {
      Itemtext = null
    } else {
      Itemtext = Itemtext.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Itemeffect = req.body.effect;
    if (Itemeffect == '') {
      Itemeffect = null
    } else {
      Itemeffect = Itemeffect.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Itemtype = req.body.type;
    if (Itemtype == '') {
      Itemtype = null
    }
  var Itemcount = req.body.count;
    if (Itemcount == '') {
      Itemcount = null
    }
  var Itemroute = req.body.route;
    if (Itemroute == '') {
      Itemroute = null
    }
  var QueryString = "INSERT INTO aquafeq.aquafitem(item_name, item_text, item_effect, item_type, item_count, item_route) values ($1, $2, $3, $4, $5, $6);"
  await client.query(QueryString, [Itemname, Itemtext, Itemeffect, Itemtype, Itemcount, Itemroute], async function (err, response){

    var QueryString = 'select item_name from aquafeq.aquafitem ORDER BY item_name collate "ko_KR.utf8";'
    await client.query(QueryString, async function (err, response){
      await response;
      if (err) {
        res.redirect('/');
      } else {
        res.render('item', {
          title:'AAF 아이템',
          data: response.rows
        });
      };
    });
  });
});

//아이템 변경
router.get('/fixitem', async function(req,res,next) {
  var QueryString = "select item_name from aquafeq.aquafitem"
  await client.query(QueryString, async function (err, response){
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafitem where item_name = $1"
    await client.query(QueryString, [Select_name], async function (err, response){
      await response;
      if(typeof(response.rows[0]) !== "object") {
        res.render ('additem', {
          title: '신규 아이템 ' +Select_name + ' 등록',
        });
      } else {
        res.render ('fixitem', {
          title:Select_name + '정보',
          data:response.rows[0]
        });
      }
    });
  });
})

router.post('/fixitem', async function(req,res,next) {
  var Itemname = req.body.name;
  var Eqid = req.body.eqid;
  console.log(Eqid)

  var Itemtext = req.body.text;
    if (Itemtext == '') {
      Itemtext = null;
    } else if (Itemtext !== '') {
      Itemtext = Itemtext.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Itemeffect = req.body.effect;
    if (Itemeffect == '') {
      Itemeffect = null;
    } else if (Itemeffect !== '') {
      Itemeffect = Itemeffect.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Itemtype = req.body.type;
    if (Itemtype == '') {
      Itemtype = null;
    }
  var Itemcount = req.body.count;
    if (Itemcount == '') {
      Itemcount = null;
    }
  var Itemroute = req.body.route;
    if (Itemroute == '') {
      Itemroute = null;
    }


  var QueryString = "UPDATE aquafeq.aquafitem SET (item_name, item_text, item_effect, item_type, item_count, item_route) = ($1, $2, $3, $4, $5, $6)  WHERE item_id = $7 returning *"
  //client.query("UPDATE aquafeq.aquafwp SET wpgrade = Wpgrade, wplimit =Wplimit, wpsocket=Wpsocket, wpether=Wpether, wpstats=Wpstats, wpproperty=Wpproperty, wpfeat=Wpfeat, wpcustom=Wpcustom, wpup=Wpup  WHERE wpname = Wpname ",  (err, response) => {
  await client.query(QueryString, [Itemname, Itemtext, Itemeffect, Itemtype, Itemcount, Itemroute, Eqid], async function (err, response){

    var QueryString = "select * from aquafeq.aquafitem where item_name = $1"
    await client.query ( QueryString, [Itemname],  async function(err, response) {
      await response;
      if (err) {
        console.log(err)
        res.redirect('/')
      } else {
        var TotalCount = 1;
      }
      var DataCountInPage = 10;
      var PageSize = 10;
      var CurrentPage = 1;
      var TotalPage = parseInt(TotalCount / DataCountInPage, 10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      };
      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      };
      var StartPage = parseInt(((CurrentPage - 1) / 10), 10) * 10 + 1;
      var EndPage = StartPage + DataCountInPage - 1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      };

      res.render('item', {
        title:'AAF 아이템',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage: TotalPage,
        searchtype: encodeURIComponent(name),
        Search: encodeURIComponent(Itemname),
      });


      // res.render('item', {
      //   title : Itemname + ' 변경 완료',
      //   data: response.rows
      // })
    });
  });
});



//일반 검색
router.get('/:id', async function(req,res,next) {
  var searchtype = req.query.searchtype;
  var QueryString = '';

  if (searchtype === 'name') {
    var Search = req.query.searchtext;
    if (Search == null ) {
      var Search = ""
    }
    var CurrentPage = req.params.id;
    CurrentPage = parseInt(CurrentPage)


    QueryString = 'SELECT *, count(*) over() as totalcount FROM aquafeq.aquafitem where item_name Ilike $1 ORDER BY item_name collate "ko_KR.utf8" limit 10 offset (($2- 1)*10);';
      await client.query(QueryString, ['%' + Search + '%', CurrentPage], async function (err, response){
        await response;
        if (err) {
          console.log(err);
          res.redirect('/');
        }
        var TotalCount = '';
      if(typeof(response.rows[0]) !== "object") {
        TotalCount = 1;
      } else {
        TotalCount = response.rows[0].totalcount;
      }
      var DataCountInPage = 10;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      }
      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      }
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      var EndPage = StartPage + DataCountInPage -1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      }
      res.render('item', {
        title:'AAF 아이템',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage: TotalPage,
        searchtype: encodeURIComponent(searchtype),
        Search: encodeURIComponent(Search),
      });
    });
  } else if (searchtype === 'effect') {
    CurrentPage = req.params.id;
    CurrentPage = parseInt(CurrentPage);

    QueryString = 'SELECT *, count(*) over() as totalcount FROM aquafeq.aquafitem where item_name Ilike $1 ORDER BY item_name collate "ko_KR.utf8" limit 10 offset (($2- 1)*10);';
      await client.query(QueryString, ['%' + Search + '%', CurrentPage], async function (err, response){
        await response;
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      var DataCountInPage = 10;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      };
      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      };
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      var EndPage = StartPage + DataCountInPage -1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      };
      res.render('item', {
        title:'AAF 아이템',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage: TotalPage,
        searchtype: encodeURIComponent(searchtype),
        Search: encodeURIComponent(Search),
      });
    });
  }
})





module.exports = router;
