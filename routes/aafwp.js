var express = require('express');
var router = express.Router();
var app = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

router.get('/', (req,res,next) => {
  res.render('aafwp', {
    title:'AAF 장비'
  });
});

router.get('/:id', (req,res,next) => {
  var SearchType = req.query.searchType;
  if (SearchType === 'name') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var SearchLimit = req.query.limit;
    if (SearchLimit === undefined) {
      SearchLimit = 1;
    };
    console.log(SearchLimit)
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpname LIKE $1 and cast(wplimit as INTEGER) >= $2 or wplimit is null  ORDER BY wplimit,wpid asc limit 10 offset (($3- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', SearchLimit, CurrentPage], (err, response) => {
      console.log('서치리밋' + SearchLimit);
      if(typeof(response.rows[0]) !== "object") {
        var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      console.log('토탈 카운트 ' + TotalCount)
      console.log(CurrentPage)
      console.log(typeof(CurrentPage))
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

      res.render('aafwp', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage: TotalPage,
        SearchType: SearchType,
        Search: Search,
        SearchLimit: SearchLimit
      });
    });
  } else if (SearchType === 'property') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id
    var SearchLimit = req.query.limit;
    if (SearchLimit === undefined) {
      SearchLimit = 1;
    };
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpproperty LIKE $1 and cast(wplimit as INTEGER) >= $2 or wplimit is null  ORDER BY wplimit asc limit 10 offset (($3- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', SearchLimit, CurrentPage], (err, response) => {
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
      res.render('aafwp', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage:TotalPage,
        SearchType: SearchType,
        Search: Search,
        SearchLimit: SearchLimit
      });
    });
  } else if (SearchType === 'feat') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id
    var SearchLimit = req.query.limit;
    if (SearchLimit === undefined) {
      SearchLimit = 1;
    };
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpfeat LIKE $1 and cast(wplimit as INTEGER) >= $2 or wplimit is null  ORDER BY wplimit asc limit 10 offset (($3- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', SearchLimit, CurrentPage], (err, response) => {
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
      res.render('aafwp', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage:TotalPage,
        SearchType: SearchType,
        Search: Search,
        SearchLimit: SearchLimit
      });
    });
  } else if (SearchType === 'custom') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id
    var SearchLimit = req.query.limit;
    if (SearchLimit === undefined) {
      SearchLimit = 1;
    };
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafwp where wpcustom LIKE $1 and cast(wplimit as INTEGER) >= $2 or wplimit is null  ORDER BY wplimit asc limit 10 offset (($3- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', SearchLimit, CurrentPage], (err, response) => {
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
      res.render('aafwp', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage:TotalPage,
        SearchType: SearchType,
        Search: Search,
        SearchLimit: SearchLimit
      });
    });
  } else {
    res.redirect('/aafwp');
  };
});




module.exports = router;
