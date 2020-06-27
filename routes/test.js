var express = require('express');
var router = express.Router();
var app = express();
var $ = require('jquery');


const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();
router.get('/', (req,res,next) => {
  var QueryString = "select wpid, wpname from aquafeq.aquafwp ORDER BY wplimit,wpid asc ;"
  client.query(QueryString, (err, response) => {
    if (err) {
      res.redirect('/test');
    } else {
      res.render('test', {
        title:'AAF 장비',
        data:response.rows
      });
    };
  });
});

router.get('/addwp', (req,res,next) => {
  res.render ('addwp', {
    title:'AAF 무기 등록'
  });
});

//무기 추가하기
router.post('/', (req, res, next) => {
  var Wpgrade = req.body.wpgrade;
    if (Wpgrade !== '') {
      Wpgrade = Wpgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Wpname = req.body.wpname;
  var Wplimit = req.body.wplimit;
    if (Wplimit == '') {
        Wplimit = null
    }
  var Wpsocket = req.body.wpsocket;
  var Wpether = req.body.wpether;
  var Wpstats = req.body.wpstats;
    if (Wpstats !== '') {
      Wpstats = Wpstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpproperty = req.body.wpproperty;
    if (Wpproperty !== '') {
      Wpproperty = Wpproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpfeat = req.body.wpfeat;
    if (Wpfeat !== '') {
      Wpfeat = Wpfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpcustom = req.body.wpcustom;
    if (Wpcustom !== ''){
      Wpcustom = Wpcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpup = req.body.wpup;
    if (Wpup !== '') {
      Wpup = Wpup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var QueryString = "INSERT INTO aquafeq.aquafwp(wpgrade, wpname, wplimit, wpsocket, wpether, wpstats, wpproperty, wpfeat, wpcustom, wpup) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);"
  client.query(QueryString, [Wpgrade, Wpname, Wplimit, Wpsocket, Wpether, Wpstats, Wpproperty, Wpfeat, Wpcustom, Wpup], (err, response) => {
    var QueryString = "select wpid, wpname from aquafeq.aquafwp where wpname = Wpname ORDER BY wplimit,wpid asc ;"
    client.query(QueryString, (err, response) => {
      res.render('test', {
        title:'AAF 장비',
        data:response.rows
      });
    });
  });
});

//무기 변경 라우트
router.get('/fixwp', (req,res,next) => {
  var QueryString = "select wpname from aquafeq.aquafwp"
  client.query(QueryString, (err, response) => {
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafwp where wpname = $1"
    client.query(QueryString, [Select_name], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        res.render ('addwp', {
          title: '신규 장비 ' + Select_name + ' 등록',
        });
      } else {
        res.render ('fixwp', {
          title:Select_name + '정보',
          data:response.rows[0]
        });
      }
    });
  });
});

//무기 변경하기
router.post('/fixwp', (req,res,next) => {
  console.log('냠냠')
  var Eqid = req.body.eqid;

  console.log(Eqid)
  console.log(req.body.eqid)
  var Wpgrade = req.body.wpgrade;
    if (Wpgrade == '') {
      Wpgrade = null
    } else if (Wpgrade !== '') {
      Wpgrade = Wpgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    console.log(req.body.wpgrade)

  var Wpname = req.body.wpname;
  console.log(req.body.wpname)

  var Wplimit = req.body.wplimit;
    if (Wplimit == '') {
      Wplimit = null
    }
    console.log(req.body.wplimit)

  var Wpsocket = req.body.wpsocket;
    if (Wpsocket == '') {
      Wpsocket = null
    }
  var Wpether = req.body.wpether;
    if (Wpether == '') {
      Wpether = null
    }
  var Wpstats = req.body.wpstats;
    if (Wpstats == '') {
      Wpstats = null
    } else if (Wpstats !== '') {
      Wpstats = Wpstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Wpproperty = req.body.wpproperty;
    if (Wpproperty == '') {
      Wpproperty = null
    } else if (Wpproperty !== '') {
      Wpproperty = Wpproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpfeat = req.body.wpfeat;
    if (Wpfeat == '') {
      Wpfeat = null
    } else if (Wpfeat !== '') {
      Wpfeat = Wpfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpcustom = req.body.wpcustom;
    if (Wpcustom == '') {
      Wpcustom = null
    } else if (Wpcustom !== ''){
      Wpcustom = Wpcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpup = req.body.wpup;
    if (Wpup == '') {
      Wpup = null
    } else if (Wpup !== '') {
      Wpup = Wpup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }


  var QueryString = "UPDATE aquafeq.aquafwp SET (wpgrade, wplimit, wpsocket, wpether, wpstats, wpproperty, wpfeat, wpcustom, wpup, wpname) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  WHERE wpid = $11 returning *"
  //client.query("UPDATE aquafeq.aquafwp SET wpgrade = Wpgrade, wplimit =Wplimit, wpsocket=Wpsocket, wpether=Wpether, wpstats=Wpstats, wpproperty=Wpproperty, wpfeat=Wpfeat, wpcustom=Wpcustom, wpup=Wpup  WHERE wpname = Wpname ",  (err, response) => {
  client.query(QueryString, [Wpgrade, Wplimit, Wpsocket, Wpether, Wpstats, Wpproperty, Wpfeat, Wpcustom, Wpup, Wpname, Eqid], (err, response) => {
    console.log('쿼리스트링' + QueryString)

    var QueryString = "select * from aquafeq.aquafwp where wpname = $1"
    client.query ( QueryString, [Wpname],  (err, response) => {
      console.log('쿼리스트링' + QueryString)
      res.render('test', {
        title : Wpname + ' 변경 완료',
        data: response.rows
      })
    });
  });
});

// 일반 검색
router.get('/:id', (req,res,next) => {
  var SearchType = req.query.searchType;
  if (SearchType === 'name') {
    console.log(req.query.searchText2);
    console.log(req.query.searchType2);
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    if (req.query.searchText2 != undefined) {
      var Search2 = req.query.searchText2;
      var SearchType2 = req.query.searchType2;
      var Searchcount = req.query.searchText2.length;
      for (var i = 0; i < Searchcount; i++) {
        var SearchPlus = 'AND SearchType2.[i] Ilike Search2.[i]'
        SearchPlus = + SearchPlus
      }
      //var SearchPlus = 'AND SearchType2.[0] Ilike Search2.[0] AND SearchType2.[1] Ilike Search2.[1] AND SearchType2.[2] Ilike Search2.[2] '
      console.log(SearchPlus)
      //SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp WHERE wpname Ilike $1  ORDER BY wplimit,wpid asc limit 10 offset (($2- 1)*10)
      var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpname Ilike $1 " + SearchPlus + " ORDER BY wplimit,wpid asc limit 10 offset (($2- 1)*10);"
    } else {
      var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpname Ilike $1 ORDER BY wplimit,wpid asc limit 10 offset (($2- 1)*10);"

    }
    console.log(QueryString)
    client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      //console.log('토탈 카운트 ' + TotalCount)
      //console.log(CurrentPage)
      //console.log(typeof(CurrentPage))
      var DataCountInPage = 10;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      };

      //console.log('토탈 페이지' + TotalPage);
      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      };
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      //console.log('스타트페이지' + StartPage);

      var EndPage = StartPage + DataCountInPage -1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      };
      //console.log('엔드페이지'+ EndPage);
      //console.log(response.rows[0])
      res.render('test', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage: TotalPage,
        SearchType: SearchType,
        Search: Search,
      });
    });
  } else if (SearchType === 'property') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id


    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpproperty Ilike $1 ORDER BY wplimit asc limit 10 offset (($2- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
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
      res.render('test', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage:TotalPage,
        SearchType: SearchType,
        Search: Search,

      });
    });
  } else if (SearchType === 'feat') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id

    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpfeat Ilike $1  ORDER BY wplimit asc limit 10 offset (($2- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
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
      res.render('test', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage:TotalPage,
        SearchType: SearchType,
        Search: Search,

      });
    });
  } else if (SearchType === 'custom') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id

    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpcustom Ilike $1 ORDER BY wplimit asc limit 10 offset (($2- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
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
      res.render('test', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage:TotalPage,
        SearchType: SearchType,
        Search: Search,

      });
    });
  } else {
    res.redirect('/test');
  };
})





module.exports = router;
