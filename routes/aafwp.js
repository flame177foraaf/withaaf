var express = require('express');
var app = express();
var $ = require('jquery');
var url = require('url');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());
var { Client } = require('pg');
var client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();

var client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();
router.get('/', async function(req,res,next) {
  res.render('aafwp', {
    title:'AAF 장비'
  });
});

router.get('/addwp', async function(req,res,next) {
  res.render ('addwp', {
    title:'AAF 무기 등록'
  });
});

//무기 추가하기
router.post('/', async function(req,res,next) {
  var Wpgrade = req.body.wpgrade;
    if (Wpgrade !== '') {
      Wpgrade = Wpgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
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
      Wpstats = Wpstats.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var Wpproperty = req.body.wpproperty;
    if (Wpproperty !== '') {
      Wpproperty = Wpproperty.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var Wpfeat = req.body.wpfeat;
    if (Wpfeat !== '') {
      Wpfeat = Wpfeat.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var Wpcustom = req.body.wpcustom;
    if (Wpcustom !== ''){
      Wpcustom = Wpcustom.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var Wpup = req.body.wpup;
    if (Wpup !== '') {
      Wpup = Wpup.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var QueryString = "INSERT INTO aquafeq.aquafwp(wpgrade, wpname, wplimit, wpsocket, wpether, wpstats, wpproperty, wpfeat, wpcustom, wpup) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);";
  await client.query(QueryString, [Wpgrade, Wpname, Wplimit, Wpsocket, Wpether, Wpstats, Wpproperty, Wpfeat, Wpcustom, Wpup], async function (err, response){
    var QueryString = "select wpid, wpname from aquafeq.aquafwp where wpname = Wpname ORDER BY wplimit,wpid asc ;";
    await client.query(QueryString, function (err, response){
      res.render('aafwp', {
        title:'AAF 장비',
        data:response.rows
      });
    });
  });
});

//무기 변경 라우트
router.get('/fixwp', async function(req,res,next) {
  var QueryString = "select wpname from aquafeq.aquafwp";
  await client.query(QueryString, async function (err, response){
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafwp where wpname = $1";
    await client.query(QueryString, [Select_name], function (err, response){
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
router.post('/fixwp', async function(req,res,next) {
  console.log('냠냠');
  var Eqid = req.body.eqid;

  console.log(Eqid);
  console.log(req.body.eqid);
  var Wpgrade = req.body.wpgrade;
    if (Wpgrade == '') {
      Wpgrade = null
    } else if (Wpgrade !== '') {
      Wpgrade = Wpgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
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
      Wpstats = Wpstats.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }

  var Wpproperty = req.body.wpproperty;
    if (Wpproperty == '') {
      Wpproperty = null
    } else if (Wpproperty !== '') {
      Wpproperty = Wpproperty.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var Wpfeat = req.body.wpfeat;
    if (Wpfeat == '') {
      Wpfeat = null
    } else if (Wpfeat !== '') {
      Wpfeat = Wpfeat.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var Wpcustom = req.body.wpcustom;
    if (Wpcustom == '') {
      Wpcustom = null
    } else if (Wpcustom !== ''){
      Wpcustom = Wpcustom.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var Wpup = req.body.wpup;
    if (Wpup == '') {
      Wpup = null
    } else if (Wpup !== '') {
      Wpup = Wpup.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }


  var QueryString = "UPDATE aquafeq.aquafwp SET (wpgrade, wplimit, wpsocket, wpether, wpstats, wpproperty, wpfeat, wpcustom, wpup, wpname) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  WHERE wpid = $11 returning *"
  //client.query("UPDATE aquafeq.aquafwp SET wpgrade = Wpgrade, wplimit =Wplimit, wpsocket=Wpsocket, wpether=Wpether, wpstats=Wpstats, wpproperty=Wpproperty, wpfeat=Wpfeat, wpcustom=Wpcustom, wpup=Wpup  WHERE wpname = Wpname ",  (err, response) => {
  await client.query(QueryString, [Wpgrade, Wplimit, Wpsocket, Wpether, Wpstats, Wpproperty, Wpfeat, Wpcustom, Wpup, Wpname, Eqid], async function (err, response){
    console.log('쿼리스트링' + QueryString)

    var QueryString = "select * from aquafeq.aquafwp where wpname = $1"
    await client.query ( QueryString, [Wpname],  function(err, response) {
      console.log('쿼리스트링' + QueryString);
      res.render('aafwp', {
        title : Wpname + ' 변경 완료',
        data: response.rows
      });
    });
  });
});

// 일반 검색
router.get('/:id', async function(req,res,next) {
  console.log(url.parse(req.url, true));

  var CurrentPage = req.params.id;
  var CurrentPage = parseInt(CurrentPage);
  var searchtype = req.query.searchtype;
  var Search = req.query.searchtext;
  if (Search == null ) {
    var Search = "";
  }

  var SearchPlus = "";
  var Search2 = req.query.searchtext2;

  var searchtype2 = req.query.searchtype2;
  var searchtype22 = [];

  if (searchtype != '1stats' && searchtype != '2stats') {
    var Search22 = [];


    if (Search2 !== undefined) {
      console.log('추가 검색' + Search2);
      console.log('추가 검색타입 '+ typeof(Search2));
      if (typeof(Search2) == 'object') {
        for (var i = 0; i < Search2.length; i++) {
          Search22.push(Search2[i]) ;
        }
      } else if(typeof(Search2) == 'string' ){
          Search22.push(Search2) ;
      }
      // 포 문 에서 search2 배열의 각각의 값중에서 빈 값이 있는 경우 빈 배열에 넣지않고 그냥 넘어가는 작업을 해야함, 이에 따라 아래의 타입 배열에 넣는 경우에서도 동일함

      if (typeof(searchtype2) == 'object') {
        for (var i = 0; i < Search2.length; i++) {
          searchtype22.push(searchtype2[i]) ;
        }
      } else if(typeof(searchtype2) == 'string' ){
        searchtype22.push(searchtype2) ;
      }
      var Searchcount = Search22.length;
      if (typeof(searchtype2) == 'string') {
        var SearchPlus = SearchPlus+ ' AND ' + searchtype22+ ' Ilike ' +" '%"+ Search2 +"%' ";
      } else if (typeof(searchtype2) == 'object') {
        for (var i = 0; i < Searchcount; i++) {
          var SearchPlus = SearchPlus+ ' AND ' + searchtype22[i] + ' Ilike ' +" '%"+ Search2[i] +"%' ";
        }
      }
      console.log('req.query.searchtext2 !== undefined' + SearchPlus)
      var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp WHERE " + searchtype +" Ilike $1 " + SearchPlus + " ORDER BY wplimit,wpid asc limit 10 offset (($2- 1)*10);"

    } else {
      var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp WHERE "+ searchtype +" Ilike $1 ORDER BY wplimit,wpid asc limit 10 offset (($2- 1)*10);";

    }

      // console.log('req.query.searchtype' + Search);
      // console.log('req.query.searchtype' + searchtype);
      // console.log(Search);
      // console.log(searchtype);
      // console.log(decodeURIComponent(Search));
      // console.log(encodeURIComponent(Search));
      // console.log(CurrentPage);
      // console.log(SearchPlus);
      // console.log(Search2);
      // console.log(Search22);
      // console.log('QueryString' + QueryString);
    await client.query(QueryString, ['%' + Search +'%', CurrentPage], function (err, response){
      if (err) {
        res.redirect('/aafwp');
        console.log(err)
      }
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
      res.render('aafwp', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage: TotalPage,
        searchtype: searchtype,
        Search: Search,
        SearchPlus: SearchPlus,
        Search2: Search2,
        Search22: Search22,
        searchtype2: searchtype2,
        searchtype22: searchtype22,
        Searchcount:Searchcount



      });
    });
  } else {
    console.log(Search)
    if (Search == '' || Search == null || Search == undefined ) {
      var Search = 0;
    }

      var Search = parseInt(Search,10)
    var SearchPlus = "";
    var Search2 = req.query.searchtext2;
    if (searchtype == '1stats') {

      var QueryString = "SELECT *, count(*) over() as totalcount from (SELECT *, trim ( split_part (replace( wpstats, '+', '') , '/', 1) )::INTEGER as splitstats from aquafeq.aquafwp where not(rtrim(wpstats)='')) t1 where splitstats >= $1 ORDER by splitstats asc limit 10 offset (($2- 1)*10)";
    } else if (searchtype == '2stats') {

      var QueryString = "SELECT * , count(*) over() as totalcount  from (SELECT *, trim ( split_part (replace( wpstats, '+', '') , '/', 2) )::INTEGER as splitstats from aquafeq.aquafwp where not(rtrim(wpstats)='')) t1 where splitstats >= $1 ORDER by splitstats asc limit 10 offset (($2- 1)*10)";
    }

    await client.query(QueryString, [Search, CurrentPage], function (err, response){
      if (err) {
        res.redirect('/aafwp');

      }
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
      /*
      var emp = new Object()
      var featlink0 = response.rows[0].wpfeat
      var featlink1 = featlink0.split("(");
      var featlink2 = []
      var featlink3 = [];
      var featlink4 = ['<a href="http://aafwiki.com/wiki/"'+featlink1[0] +"(피트)/></a>"];
      for (var i = 0; i < featlink1.length; i++) {
        featlink2.push( featlink1[i].indexOf(">"));
        var featlink3 = featlink3 + ( featlink1[i].split(">"));
        if (featlink2[i] != -1) {
          //featlink4.push(featlink3.indexOf(i).substring(featlink2[i] , featlink3[i].length))

          featlink4 = featlink4 + ('<a href="http://aafwiki.com/wiki/"'+ featlink1[i].substring(featlink2[i]+1,featlink2[i].length) +'(피트)/></a>')
        }
      }
      emp.wpgrade = response.rows[0].wpgrade
      emp.wpname = response.rows[0].wpname
      emp.wplimit = response.rows[0].wplimit
      emp.wpsocket = response.rows[0].wpsocket
      emp.wpether = response.rows[0].wpether
      emp.wpstats = response.rows[0].wpstats
      emp.wpproperty = response.rows[0].wpproperty
      emp.wpfeat = featlink4
      emp.wpcustom = response.rows[0].wpcustom
      emp.wpup = response.rows[0].wpup*/
      //console.log('엔드페이지'+ EndPage);
      //console.log(response.rows[0])
      res.render('aafwp', {
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
        Search2: Search2,
        Search22: Search22,
        searchtype2: searchtype2,
        searchtype22: searchtype22,
        Searchcount:Searchcount



      });
    });
  }



})



module.exports = router;
