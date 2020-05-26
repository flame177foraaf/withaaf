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
  var QueryString = "select featid, featname from aquafeq.featsup ORDER BY featid asc ;"
  client.query(QueryString, (err, response) => {
    console.log(response.rows[0])
    if (err) {
      res.redirect('/');
    } else {
      res.render('featsup', {
        title:'AAF 장비',
        data:response.rows
      });
    };
  });});

router.get('/fixfeat', (req,res,next) => {
  res.redirect('/');
});
router.get('/add_feat', (req,res,next) => {
  res.redirect('/');
});

router.get('/:id', (req,res,next) => {
  var SearchType = req.query.searchType;
  if (SearchType === 'name') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where featname LIKE $1 ORDER BY row_number asc limit 10 offset (($2- 1)*10);"
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
      res.render('featsup', {
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
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where feat LIKE $1 ORDER BY row_number asc limit 10 offset (($2- 1)*10);"
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
      res.render('featsup', {
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
  } else if (SearchType === 'reversefeat') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where reversefeat LIKE $1 ORDER BY row_number asc limit 10 offset (($2- 1)*10);"
    client.query(QueryString, ['%' + Search + '%', CurrentPage], (err, response) => {
      var TotalCount = response.rows.totalcount;
      if (typeof(TotalCount) === 'undefined') {
        TotalCount = 1;
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
      res.render('featsup', {
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
  } else {
    res.redirect('/featsup');
  };
})


router.get('/', (req, res, next) => {
  if(req.query.searchType === 'grade') {
    var searchingtext = req.query.searchText
    var sql = 'SELECT * FROM aquaffeat WHERE featsupgrade LIKE ?' ;
    connection.query(sql, "%" + searchingtext + "%",function(err, results, field) {
      res.render('featsup', {
        title: '피트서포터',
        varaquaffeatsup: results
      });
    });
  } else if(req.query.searchType === 'name') {
    var searchingtext =req.query.searchText
    var sql = 'SELECT * FROM aquaffeat WHERE featsupname LIKE ?';
    connection.query(sql, "%" + searchingtext + "%", function(err, results, field) {
      console.log('aquaffeat 속성 검색');
      res.render('featsup', {
        title: '피트서포터',
        varaquaffeatsup: results
      });
    });
  } else if (req.query.searchType === 'feat'){
    var searchingtext =req.query.searchText
    var sql = 'SELECT * FROM aquaffeat WHERE featsupfeat LIKE ?';
    connection.query(sql, "%" + searchingtext + "%", function(err, results, field) {
      console.log('aquaffeat 피트 검색');
      res.render('featsup', {
        title: '피트서포터',
        varaquaffeatsup: results
      });
    });
  } else {
    res.render('featsupmain', {
      title: '피트서포터',
    })
  }
});

router.get('/', (req,res,next) => {
  res.render('featsupmain', {
    title: '피트서포터',
  })

});




module.exports = router;
