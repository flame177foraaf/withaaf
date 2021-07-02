var express = require('express');
var app = express();
var $ = require('jquery');
var url = require('url');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());

const client = require('../config/dbconfig.js');


router.get('/', async function(req, res, next) {
  res.render('aafarm', {
    title: 'AAF 장비',
  });
});

router.get('/addarm', async function(req, res, next) {
  res.render('addarm', {
    title: 'AAF 방어구 등록'
  });

});

router.post('/', async function(req, res, next) {
  var Armgrade = req.body.armgrade;
  if (Armgrade !== '') {
    Armgrade = Armgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  var Armname = req.body.armname;
  var Armlimit = req.body.armlimit;
  var Armsocket = req.body.armsocket;
  var Armether = req.body.armether;
  var Armstats = req.body.armstats;
  if (Armstats !== '') {
    Armstats = Armstats.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Armproperty = req.body.armproperty;
  if (Armproperty !== '') {
    Armproperty = Armproperty.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Armfeat = req.body.armfeat;
  if (Armfeat !== '') {
    Armfeat = Armfeat.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Armcustom = req.body.armcustom;
  if (Armcustom !== '') {
    Armcustom = Armcustom.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Armup = req.body.armup;
  if (Armup !== '') {
    Armup = Armup.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var QueryString = "INSERT INTO aquafeq.aquafarm(armgrade, Armname, Armlimit, Armsocket, Armether, Armstats, Armproperty, Armfeat, Armcustom, Armup) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);"



  client.query(QueryString, [Armgrade, Armname, Armlimit, Armsocket, Armether, Armstats, Armproperty, Armfeat, Armcustom, Armup], async function(err, response) {
    var QueryString = "select armid, Armname from aquafeq.aquafarm where armname = armname ORDER BY armlimit,armid asc ;"
    await client.query(QueryString, async function(err, response) {
      await response;


      res.render('aafarm', {
        title: 'AAF 장비',
        data: response.rows
      });
    });
  });
});
router.get('/fixarm', async function(req, res, next) {
  var QueryString = "select armname from aquafeq.aquafarm"

  await client.query(QueryString, async function(err, response) {
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafarm where armname = $1"
    await client.query(QueryString, [Select_name], async function(err, response) {
      await response;


      if (typeof(response.rows[0]) !== "object") {
        res.render('addarm', {
          title: '신규 장비 ' + Select_name + ' 등록',
        });
      } else {
        res.render('fixarm', {
          title: Select_name + '정보',
          data: response.rows[0]
        });
      }
    });
  });
});


//무기 변경하기
router.post('/fixarm', async function(req, res, next) {
  var Eqid = req.body.eqid;
  console.log(Eqid)

  var Armgrade = req.body.armgrade;
  if (Armgrade !== '') {
    Armgrade = Armgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Armname = req.body.armname;
  var Armlimit = req.body.armlimit;
  console.log('Armlimit = ' + Armlimit);
  var Armsocket = req.body.armsocket;
  var Armether = req.body.armether;

  var Armstats = req.body.armstats;
  if (Armstats !== '') {
    Armstats = Armstats.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  var Armproperty = req.body.armproperty;
  if (Armproperty !== '') {
    Armproperty = Armproperty.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Armfeat = req.body.armfeat;
  if (Armfeat !== '') {
    Armfeat = Armfeat.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Armcustom = req.body.armcustom;
  if (Armcustom !== '') {
    Armcustom = Armcustom.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Armup = req.body.armup;
  if (Armup !== '') {
    Armup = Armup.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }


  var QueryString = "UPDATE aquafeq.aquafarm SET (armgrade, armlimit, armsocket, armether, armstats, armproperty, armfeat, armcustom, armup, armname) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  WHERE armid = $11 returning *"

  if (Armlimit == '') {
    console.log('ㅁㄴㅇㅁㅇㄴ')
    QueryString = "UPDATE aquafeq.aquafarm SET (armgrade, armsocket, armether, armstats, armproperty, armfeat, armcustom, armup, armname) = ($1,  $3, $4, $5, $6, $7, $8, $9, 10)  WHERE armid = $11 returning *"
  }
  console.log(QueryString);

  client.query(QueryString, [Armgrade, Armlimit, Armsocket, Armether, Armstats, Armproperty, Armfeat, Armcustom, Armup, Armname, Eqid], async function(err, response) {
    console.log(QueryString);

    var QueryString = "select * from aquafeq.aquafarm where armname = $1"
    console.log(QueryString);
    await client.query(QueryString, [Armname], async function(err, response) {
      await response;


      res.render('aafarm', {
        title: Armname + ' 변경 완료',
        data: response.rows
      })
    });
  });
});

router.get('/:id', async function(req, res, next) {


  console.log(url.parse(req.url, true))

  var searchtype = req.query.searchtype;

  var Search = req.query.searchtext;
  if (Search == null) {
    var Search = ""
  }
  var CurrentPage = req.params.id;
  var CurrentPage = parseInt(CurrentPage)
  var SearchPlus = "";

  if (req.query.searchtext2 != 'undefined') {
    var Search2 = req.query.searchtext2;
    var Search22 = [];

    if (typeof(Search2) == 'object') {
      for (var i = 0; i < Search2.length; i++) {
        Search22.push(Search2[i]);
      }
    } else if (typeof(Search2) == 'string') {
      Search22.push(Search2);
    }
    // 포 문 에서 search2 배열의 각각의 값중에서 빈 값이 있는 경우 빈 배열에 넣지않고 그냥 넘어가는 작업을 해야함, 이에 따라 아래의 타입 배열에 넣는 경우에서도 동일함

    var searchtype2 = req.query.searchtype2;
    var searchtype22 = [];
    if (typeof(searchtype2) == 'object') {
      for (var i = 0; i < Search2.length; i++) {
        searchtype22.push(searchtype2[i]);
      }
    } else if (typeof(searchtype2) == 'string') {
      searchtype22.push(searchtype2);
    }
    var Searchcount = Search22.length;
    if (typeof(searchtype2) == 'string') {
      var SearchPlus = SearchPlus + ' AND ' + searchtype22 + ' Ilike ' + " '%" + Search2 + "%' "
    } else if (typeof(searchtype2) == 'object') {
      for (var i = 0; i < Searchcount; i++) {
        var SearchPlus = SearchPlus + ' AND ' + searchtype22[i] + ' Ilike ' + " '%" + Search2[i] + "%' "
      }
    }
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafarm WHERE " + searchtype + " Ilike $1 " + SearchPlus + " ORDER BY armlimit,armid asc limit 10 offset (($2- 1)*10);"
  } else {
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafarm WHERE " + searchtype + " Ilike $1 ORDER BY armlimit,armid asc limit 10 offset (($2- 1)*10);"

  }





  await client.query(QueryString, ['%' + Search + '%', CurrentPage], async function(err, response) {

    await response;

    if (err) {
      res.redirect('/aafarm');
      console.log(err)
    } else if (typeof(response.rows[0]) !== "object") {
      var TotalCount = 1;
    } else {
      var TotalCount = response.rows[0].totalcount;
    }
    //console.log('토탈 카운트 ' + TotalCount)
    //console.log(CurrentPage)
    //console.log(typeof(CurrentPage))
    var DataCountInPage = 10;
    var PageSize = 10;
    var TotalPage = parseInt(TotalCount / DataCountInPage, 10);
    if (TotalCount % DataCountInPage > 0) {
      TotalPage++;
    };

    //console.log('토탈 페이지' + TotalPage);
    if (TotalPage < CurrentPage) {
      CurrentPage = TotalPage;
    };
    var StartPage = parseInt(((CurrentPage - 1) / 10), 10) * 10 + 1;
    //console.log('스타트페이지' + StartPage);

    var EndPage = StartPage + DataCountInPage - 1;
    if (EndPage > TotalPage) {
      EndPage = TotalPage;
    };


    //console.log('엔드페이지'+ EndPage);
    //console.log(response.rows[0])
    res.render('aafarm', {
      title: 'AAF 장비',
      data: response.rows,
      CurrentPage: CurrentPage,
      PageSize: PageSize,
      StartPage: StartPage,
      EndPage: EndPage,
      TotalPage: TotalPage,
      searchtype: encodeURIComponent(searchtype),
      Search: encodeURIComponent(Search),
      SearchPlus: SearchPlus,
      Search2: encodeURIComponent(Search2),
      Search22: encodeURIComponent(Search22),
      searchtype2: encodeURIComponent(searchtype2),
      searchtype22: encodeURIComponent(searchtype22),
      Searchcount: Searchcount


    });
  });

})

module.exports = router;
