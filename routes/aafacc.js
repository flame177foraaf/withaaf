var express = require('express');
var app = express();
var $ = require('jquery');
var url = require('url');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());
const client = require('../config/dbconfig.js');

router.get('/', async function(req,res,next) {
  res.render('aafacc', {
    title:'AAF 장비',
  });
});

router.get('/addacc', async function(req,res,next) {
  res.render ('addacc', {
    title:'AAF 악세사리 등록'
  });

});

router.post('/', async function(req,res,next) {
  var Accgrade = req.body.accgrade;
    if (Accgrade !== '' || Accgrade.trim() !== "") {
      Accgrade = Accgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else if (Accgrade == null ) {
      Accgrade = ""
    }

  var Accname = req.body.accname;
  var Acclimit = req.body.acclimit;
    if (Acclimit !== '' || Acclimit.trim() !== "") {
      Acclimit = Acclimit.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else if (Acclimit == null ) {
      Acclimit = ""
    }
  var Accsocket = req.body.accsocket;
    if (Accsocket !== '' || Accsocket.trim() !== "") {
      Accsocket = Accsocket.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else if (Accsocket == null ) {
      Accsocket = ""
    }
  var Accether = req.body.accether;
    if (Accether !== '' || Accether.trim() !== "") {
      Accether = Accether.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else if (Accether == null ) {
      Accether = ""
    }
  var Accstats = req.body.accstats;
    if (Accstats !== '' || Accstats.trim() !== "") {
      Accstats = Accstats.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else if (Accstats == null ) {
      Accstats = ""
    }
  var Accproperty = req.body.accproperty;
    if (Accproperty !== '' || Accproperty.trim() !== "") {
      Accproperty = Accproperty.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else if (Accproperty == null ) {
      Accproperty = ""
    }
  var Accfeat = req.body.accfeat;
    if (Accfeat !== '' || Accfeat.trim() !== "") {
      Accfeat = Accfeat.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else if (Accfeat == null ) {
      Accfeat = ""
    }
  var Acccustom = req.body.acccustom;
    if (Acccustom !== '' || Acccustom.trim() !== "") {
      Acccustom = Acccustom.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else if (Acccustom == null ) {
      Acccustom = ""
    }
  var Accup = req.body.accup;
    if (Accup !== '' || Accup.trim() !== "") {
      Accup = Accup.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else if (Accup == null ) {
      Accup = ""
    }
  var QueryString = "INSERT INTO aquafeq.aquafacc(accgrade, accname, acclimit, accsocket, accether, accstats, accproperty, accfeat, acccustom, accup) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);";


  
  await client.query(QueryString, [Accgrade, Accname, Acclimit, Accsocket, Accether, Accstats, Accproperty, Accfeat, Acccustom, Accup], async function (err, response){
    var QueryString = "select accid, accname from aquafeq.aquafacc where accname = Accname ORDER BY acclimit,accid asc ;";
    await client.query(QueryString, async function (err, response){
      await response;
      

      res.render('aafacc', {
        title:'AAF 장비',
        data:response.rows
      });
    });
  });
});
router.get('/fixacc', async function(req,res,next) {
  var QueryString = "select accname from aquafeq.aquafacc";
  

  await client.query(QueryString, async function (err, response){
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafacc where accname = $1";
    await client.query(QueryString, [Select_name], async function (err, response){
      await response;
      

      if(typeof(response.rows[0]) !== "object") {
        res.render ('addacc', {
          title: '신규 장비 ' + Select_name + ' 등록',
        });
      } else {
        res.render ('fixacc', {
          title:Select_name + '정보',
          data:response.rows[0]
        });
      }
    });
  });
});


//무기 변경하기
router.post('/fixacc', async function(req,res,next) {
  var Eqid = req.body.eqid;
  console.log(Eqid);

    var Accgrade = req.body.accgrade;
      if (Accgrade !== '' || Accgrade.trim() !== "") {
        Accgrade = Accgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else if (Accgrade == null ) {
        Accgrade = ""
      }

    var Accname = req.body.accname;
    var Acclimit = req.body.acclimit;
      if (Acclimit !== '' || Acclimit.trim() !== "") {
        Acclimit = Acclimit.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else if (Acclimit == null ) {
        Acclimit = ""
      }
    var Accsocket = req.body.accsocket;
      if (Accsocket !== '' || Accsocket.trim() !== "") {
        Accsocket = Accsocket.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else if (Accsocket == null ) {
        Accsocket = ""
      }
    var Accether = req.body.accether;
      if (Accether !== '' || Accether.trim() !== "") {
        Accether = Accether.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else if (Accether == null ) {
        Accether = ""
      }
    var Accstats = req.body.accstats;
      if (Accstats !== '' || Accstats.trim() !== "") {
        Accstats = Accstats.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else if (Accstats == null ) {
        Accstats = ""
      }
    var Accproperty = req.body.accproperty;
      if (Accproperty !== '' || Accproperty.trim() !== "") {
        Accproperty = Accproperty.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else if (Accproperty == null ) {
        Accproperty = ""
      }
    var Accfeat = req.body.accfeat;
      if (Accfeat !== '' || Accfeat.trim() !== "") {
        Accfeat = Accfeat.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else if (Accfeat == null ) {
        Accfeat = ""
      }
    var Acccustom = req.body.acccustom;
      if (Acccustom !== '' || Acccustom.trim() !== "") {
        Acccustom = Acccustom.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else if (Acccustom == null ) {
        Acccustom = ""
      }
    var Accup = req.body.accup;
      if (Accup !== '' || Accup.trim() !== "") {
        Accup = Accup.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else if (Accup == null ) {
        Accup = ""
      }


  var QueryString = "UPDATE aquafeq.aquafacc SET (accgrade, acclimit, accsocket, accether, accstats, accproperty, accfeat, acccustom, accup, accname) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  WHERE accid = $11 returning *";


  
  await client.query(QueryString, [Accgrade, Acclimit, Accsocket, Accether, Accstats, Accproperty, Accfeat, Acccustom, Accup, Accname, Eqid], async function(err, response) {

    var QueryString = "select * from aquafeq.aquafacc where accname = $1";
    await client.query ( QueryString, [Accname],  async function (err, response) {
      await response;
      

      res.render('aafacc', {
        title : Accname + ' 변경 완료',
        data: response.rows
      });
    });
  });
});

router.get('/:id', async function(req,res,next) {

  console.log(url.parse(req.url, true));

  var searchtype = req.query.searchtype;

  var Search = req.query.searchtext;
  if (Search == null ) {
    var Search = "";
  }
  var CurrentPage = req.params.id;
  var CurrentPage = parseInt(CurrentPage);

  var SearchPlus = "";

  if (req.query.searchtext2 != 'undefined') {
    var Search2 = req.query.searchtext2;
    var Search22 = [];

    if (typeof(Search2) == 'object') {
      for (var i = 0; i < Search2.length; i++) {
        Search22.push(Search2[i]) ;
      }
    } else if(typeof(Search2) == 'string' ){
        Search22.push(Search2) ;
    }
    // 포 문 에서 search2 배열의 각각의 값중에서 빈 값이 있는 경우 빈 배열에 넣지않고 그냥 넘어가는 작업을 해야함, 이에 따라 아래의 타입 배열에 넣는 경우에서도 동일함

    var searchtype2 = req.query.searchtype2;
    var searchtype22 = [];
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
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafacc WHERE " + searchtype +" Ilike $1 " + SearchPlus + " ORDER BY acclimit,accid asc limit 10 offset (($2- 1)*10);";
  } else {
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafacc WHERE "+ searchtype +" Ilike $1 ORDER BY acclimit,accid asc limit 10 offset (($2- 1)*10);";

  }


  
  await client.query(QueryString, ['%' + Search + '%', CurrentPage], async function (err, response){
    await response;
    

    if (err) {
      res.redirect('/aafacc');
      console.log(err);
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
    var TotalPage = parseInt(TotalCount / DataCountInPage,10);
    if (TotalCount % DataCountInPage > 0) {
      TotalPage++;
    }

    //console.log('토탈 페이지' + TotalPage);
    if (TotalPage < CurrentPage) {
      CurrentPage = TotalPage;
    }
    var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
    //console.log('스타트페이지' + StartPage);

    var EndPage = StartPage + DataCountInPage -1;
    if (EndPage > TotalPage) {
      EndPage = TotalPage;
    }
    //console.log('엔드페이지'+ EndPage);
    //console.log(response.rows[0])
    res.render('aafacc', {
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

});

module.exports = router;
