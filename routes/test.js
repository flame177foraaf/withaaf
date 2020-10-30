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
      res.render('test', {
        title:'AAF 장비',
      });
});

router.get('/fixfeat', (req,res,next) => {
  var QueryString = "select featname from aquafeq.featsup"
  client.query(QueryString, (err, response) => {
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.featsup where featname = $1"
    client.query(QueryString, [Select_name], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        res.render ('addfeat', {
          title: '신규 피트서포터 ' + Select_name + ' 등록',
        });
      } else {
        res.render ('fixfeat', {
          title:Select_name + '정보',
          data:response.rows[0]
        });
      }
    });
  });
});

router.post('/fixfeat', (req,res,next) => {
  var Eqid = req.body.eqid;
  console.log(Eqid)

  var Featgrade =req.body.grade;
    if (Featgrade !== '') {
      Featgrade = Featgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Featname = req.body.name;
  var Feat = req.body.feat;
    if (Feat !== '') {
      Feat = Feat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Reversefeat =req.body.reversefeat;
    if (Reversefeat !== '') {
      Reversefeat = Reversefeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Featup = req.body.up;
    if (Featup !== '') {
      Featup = Featup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var QueryString = "UPDATE aquafeq.featsup SET (featgrade, feat, reversefeat, featup, featname) = ($1, $2, $3, $4, $5)  WHERE featid = $6 returning *"
  client.query(QueryString, [Featgrade, Feat, Reversefeat, Featup, Featname, Eqid], (err, response) => {
    var QueryString = "select * from aquafeq.featsup"
    client.query (QueryString, (err, response) => {
      res.render('test', {
        title : Featname + ' 변경 완료',
        data: response.rows
      })
    });
  });
});


router.get('/add_feat', (req,res,next) => {
  res.render('addfeat', {
    title:'AAF 장비'
  });
});

router.post('/add_feat', (req,res,next) => {
  var Featgrade =req.body.grade;
    if (Featgrade !== '') {
      Featgrade = Featgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Featname = req.body.name;
  var Feat = req.body.feat;
    if (Feat !== '') {
      Feat = Feat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Reversefeat =req.body.reversefeat;
    if (Reversefeat !== '') {
      Reversefeat = Reversefeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Featup = req.body.up;
    if (Featup !== '') {
      Featup = Featup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var QueryString = "INSERT INTO aquafeq.featsup(featgrade, featname, feat, reversefeat, featup) values ($1, $2, $3, $4, $5);"
  client.query(QueryString, [Featgrade, Featname, Feat, Reversefeat, Featup], (err, response) => {
    var QueryString = "select featid, featname from aquafeq.featsup where featname = Featname ORDER BY featid asc ;"
    client.query(QueryString, (err, response) => {
      res.render('test', {
        title:'AAF 피트서포터',
        data:response.rows
      });
    });
  });
});

router.get('/:id', (req,res,next) => {
  var SearchType = req.query.searchType;
  if (SearchType === 'name') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where featname Ilike $1 ORDER BY featid asc limit 10 offset (($2- 1)*10);"
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
        TotalPage: TotalPage,
        SearchType: SearchType,
        Search: Search,
      });
    });
  } else if (SearchType === 'feat') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where feat Ilike $1 ORDER BY featid asc limit 10 offset (($2- 1)*10);"
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
        TotalPage: TotalPage,
        SearchType: SearchType,
        Search: Search,
      });
      console.log(Search)

    });
  } else if (SearchType === 'reversefeat') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where reversefeat Ilike $1 ORDER BY featid asc limit 10 offset (($2- 1)*10);"
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
        TotalPage: TotalPage,
        SearchType: SearchType,
        Search: Search,
      });
    })
  } else if (SearchType === 'featgrade') {
    var Search = req.query.searchText;
    var CurrentPage = req.params.id;
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where featgrade Ilike $1 ORDER BY featid asc limit 10 offset (($2- 1)*10);"
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
        TotalPage: TotalPage,
        SearchType: SearchType,
        Search: Search,
      });
    })
  } else {
    res.redirect('/featsup');
  };
})





module.exports = router;
