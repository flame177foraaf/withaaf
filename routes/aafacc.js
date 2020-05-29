var express = require('express');
var router = express.Router();

var app = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();

router.get('/', (req,res,next) => {
  var QueryString = "select accid, accname from aquafeq.aquafacc ORDER BY acclimit,accid asc ;"
  client.query(QueryString, (err, response) => {
    console.log(response.rows[0])
    if (err) {
      res.redirect('/aafacc');
    } else {
      res.render('aafacc', {
        title:'AAF 장비',
        data:response.rows
      });
    };
  });});

router.get('/addacc', (req,res,next) => {
  res.render ('addacc', {
    title:'AAF 악세사리 등록'
  });

});

router.get('/fixacc', (req,res,next) => {
  var QueryString = "select accname from aquafeq.aquafacc"
  client.query(QueryString, (err, response) => {
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafacc where accname = $1"
    client.query(QueryString, [Select_name], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        res.render ('addacc', {
          title: '신규 장비 ' Select_name + ' 등록',
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
router.post('/fixacc', (req,res,next) => {
  var Accgrade = req.body.accgrade;
    if (Accgrade == '') {
      Accgrade = null
    } else if (Accgrade !== '') {
      Accgrade = Accgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Accname = req.body.accname;
  var Acclimit = req.body.acclimit;
    if (Acclimit == '') {
      Acclimit = null
    }
  var Accsocket = req.body.accsocket;
    if (Accsocket == '') {
      Accsocket = null
    }
  var Accether = req.body.accether;
    if (Accether == '') {
      Accether = null
    }
  var Accstats = req.body.accstats;
    if (Accstats == '') {
      Accstats = null
    } else if (Accstats !== '') {
      Accstats = Accstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Accproperty = req.body.accproperty;
    if (Accproperty == '') {
      Accproperty = null
    } else if (Accproperty !== '') {
      Accproperty = Accproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Accfeat = req.body.accfeat;
    if (Accfeat == '') {
      Accfeat = null
    } else if (Accfeat !== '') {
      Accfeat = Accfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Acccustom = req.body.acccustom;
    if (Acccustom == '') {
      Acccustom = null
    } else if (Acccustom !== ''){
      Acccustom = Acccustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Accup = req.body.accup;
    if (Accup == '') {
      Accup = null
    } else if (Accup !== '') {
      Accup = Accup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }


  var QueryString = "UPDATE aquafeq.aquafacc SET (accgrade, acclimit, accsocket, accether, accstats, accproperty, accfeat, acccustom, accup) = ($1, $2, $3, $4, $5, $6, $7, $8, $9)  WHERE accname = $10 returning *"
  client.query(QueryString, [Accgrade, Acclimit, Accsocket, Accether, Accstats, Accproperty, Accfeat, Acccustom, Accup, Accname], (err, response) => {

    var QueryString = "select * from aquafeq.aquafacc where accname = $1"
    client.query ( QueryString, [Accname],  (err, response) => {
      console.log(response.rows[0])
      res.render('aafacc', {
        title : accname + ' 변경 완료',
        data: response.rows
      })
    });
  });
});

router.get('/:id', (req,res,next) => {
  var SearchType = req.query.searchType;
  if (SearchType === 'name') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;

    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafacc where accname LIKE $1 ORDER BY acclimit,accid asc limit 10 offset (($2- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log(TotalCount)
      if (TotalCount === undefined) {
        TotalCount = 1;
      }
      console.log('토탈 카운트 ' + TotalCount)
      var DataCountInPage = 10;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      };

      console.log('토탈 페이지' + TotalPage);
      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      };
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      console.log('스타트페이지' + StartPage);

      var EndPage = StartPage + DataCountInPage -1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      };
      console.log('엔드페이지'+ EndPage);

      res.render('aafacc', {
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
  } else if (SearchType === 'feat') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id

    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafacc where accfeat LIKE $1 ORDER BY acclimit,accid asc limit 10 offset (($2- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log(TotalCount)
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
      res.render('aafacc', {
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
  } else if (SearchType === 'property') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id

    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafacc where accproperty LIKE $1 ORDER BY acclimit,accid asc limit 10 offset (($2- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log(TotalCount)
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
      res.render('aafacc', {
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

    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafacc where acccustom LIKE $1 ORDER BY acclimit,accid asc limit 10 offset (($2- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log(TotalCount)
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
      res.render('aafacc', {
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
    res.redirect('/aafacc');
  };
})







module.exports = router;
