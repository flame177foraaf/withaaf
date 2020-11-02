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
  res.render('aafgem', {
    title:'AAF 장비',
  });
});

router.get('/fixgem', (req,res,next) => {
  var QueryString = "select gemname from aquafeq.aquafgem"
  client.query(QueryString, (err, response) => {
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafgem where gemname = $1"
    client.query(QueryString, [Select_name], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        res.render ('addgem', {
          title: '신규 루엘 ' + Select_name + ' 등록',
        });
      } else {
        res.render ('fixgem', {
          title:Select_name + '정보',
          data:response.rows[0]
        });
      }
    });
  });
})

router.post('/fixgem', (req,res,next) => {
  var Eqid = req.body.eqid;
  console.log(Eqid)

  console.log(Eqid)

  var Gemgrade =req.body.grade;
    if (Gemgrade !== '') {
      Gemgrade = Gemgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Collectname = req.body.name;
  var Gemname = req.body.gemname;
  var Gemobject =req.body.obj;
  var Gemeffect = req.body.effect;
    if (Gemeffect !== '') {
      Gemeffect = Gemeffect.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var QueryString = "UPDATE aquafeq.aquafgem SET (gemgrade, collectname, gemobject, gemeffect, gemname) = ($1, $2, $3, $4, $5)  WHERE gemid = $6 returning *"
  client.query(QueryString, [Gemgrade, Collectname, Gemobject, Gemeffect, Gemname, Eqid], (err, response) => {
    var QueryString = "select * from aquafeq.aquafgem where gemname = $1"
    client.query (QueryString, [Gemname],  (err, response) => {
      console.log(response.rows[0])
      res.render('aafgem', {
        title : Gemname + ' 변경 완료',
        data: response.rows
      })
    });
  });
})



router.get('/add_gem', (req,res,next) => {
  res.render('addgem', {
    title:'AAF 장비'
  });
})


router.post('/add_gem', (req,res,next) => {
  var Gemgrade =req.body.grade;
  if (Gemgrade !== '') {
    Gemgrade = Gemgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
  var Collectname = req.body.name;
  var Gemname = req.body.gemname;
  var Gemobject =req.body.obj;
  var Gemeffect = req.body.effect;
  if (Gemeffect !== '') {
    Gemeffect = Gemeffect.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
  var QueryString = "INSERT INTO aquafeq.aquafgem(gemgrade, collectname, gemname, gemobject, gemeffect) values ($1, $2, $3, $4, $5);"
  client.query(QueryString, [Gemgrade, Collectname, Gemname, Gemobject, Gemeffect], (err, response) => {
    var QueryString = "select gemid, gemname from aquafeq.aquafgem where gemname = Gemname ORDER BY gemid asc ;"
    client.query(QueryString, (err, response) => {
      res.render('aafgem', {
        title:'AAF 루엘',
        data:response.rows
      });
    });
  });
})



router.get('/:id', (req,res,next) => {
  var SearchType = req.query.searchType;
  if (SearchType === 'name') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.aquafgem where collectname Ilike $1 ORDER BY gemid asc limit 10 offset (($2- 1)*10);"
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
      res.render('aafgem', {
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
  } else if (SearchType === 'effect') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.aquafgem where gemeffect Ilike $1 ORDER BY gemid asc limit 10 offset (($2- 1)*10);"
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
      res.render('aafgem', {
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
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.aquafgem where reversefeat Ilike $1 ORDER BY gemid asc limit 10 offset (($2- 1)*10);"
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
      res.render('aafgem', {
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
});




module.exports = router;
