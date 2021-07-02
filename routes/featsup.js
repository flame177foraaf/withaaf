var express = require('express');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());
var app = express();
var url = require('url');

const client = require('../config/dbconfig.js');



router.get('/', async function(req, res, next) {
  res.render('featsup', {
    title: 'AAF 장비',
  });
});

router.get('/fixfeat', async function(req, res, next) {
  var QueryString = "select featname from aquafeq.featsup"

  // client.connect();

  await client.query(QueryString, async function(err, response) {
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.featsup where featname = $1"
    await client.query(QueryString, [Select_name], async function(err, response) {
      await response;
      // client.end();

      if (typeof(response.rows[0]) !== "object") {
        res.render('addfeat', {
          title: '신규 피트서포터 ' + Select_name + ' 등록',
        });
      } else {
        res.render('fixfeat', {
          title: Select_name + '정보',
          data: response.rows[0]
        });
      }
    });
  });
});

router.post('/fixfeat', async function(req, res, next) {
  var Eqid = req.body.eqid;
  console.log(Eqid)

  var Featgrade = req.body.grade;
  if (Featgrade !== '') {
    Featgrade = Featgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Featname = req.body.name;
  var Feat = req.body.feat;
  if (Feat !== '') {
    Feat = Feat.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Reversefeat = req.body.reversefeat;
  if (Reversefeat !== '') {
    Reversefeat = Reversefeat.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Featup = req.body.up;
  if (Featup !== '') {
    Featup = Featup.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var QueryString = "UPDATE aquafeq.featsup SET (featgrade, feat, reversefeat, featup, featname) = ($1, $2, $3, $4, $5)  WHERE featid = $6 returning *"


  await client.query(QueryString, [Featgrade, Feat, Reversefeat, Featup, Featname, Eqid], async function(err, response) {
    var QueryString = "select * from aquafeq.featsup where featname = $1"
    await client.query(QueryString, [Featname] , async function(err, response) {
      await response;

      if (err) {

          res.redirect('/featsup');
          console.log(err);
      } else {
        var TotalCount = 1;
      }
      var CurrentPage = 1;

      var DataCountInPage = 10;
      var PageSize = 10;
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

      res.render('featsup', {
        title: 'AAF 장비',
        data: response.rows,
        CurrentPage: CurrentPage,
        PageSize: PageSize,
        StartPage: StartPage,
        EndPage: EndPage,
        TotalPage: TotalPage,
        searchtype: encodeURIComponent('name'),
        Search: encodeURIComponent(Featname),
      });

      // res.render('featsup', {
      //   title : Featname + ' 변경 완료',
      //   data: response.rows
      // })
    });
  });
});


router.get('/add_feat', async function(req, res, next) {
  res.render('addfeat', {
    title: 'AAF 장비'
  });
});

router.post('/add_feat', async function(req, res, next) {
  var Featgrade = req.body.grade;
  if (Featgrade !== '') {
    Featgrade = Featgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Featname = req.body.name;
  var Feat = req.body.feat;
  if (Feat !== '') {
    Feat = Feat.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Reversefeat = req.body.reversefeat;
  if (Reversefeat !== '') {
    Reversefeat = Reversefeat.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Featup = req.body.up;
  if (Featup !== '') {
    Featup = Featup.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }


  // await  client.connect();
  var QueryString = "INSERT INTO aquafeq.featsup(featgrade, featname, feat, reversefeat, featup) values ($1, $2, $3, $4, $5);"
  await client.query(QueryString, [Featgrade, Featname, Feat, Reversefeat, Featup], async function(err, response) {
    var QueryString = "select featid, featname from aquafeq.featsup where featname = Featname ORDER BY featid asc ;"
    await client.query(QueryString, async function(err, response) {
      await response;


      res.render('featsup', {
        title: 'AAF 피트서포터',
        data: response.rows
      });
    });
  });
});

router.get('/:id', async function(req, res, next) {
  var searchtype = req.query.searchtype;
  var Search = req.query.searchtext;
  if (Search == null) {
    var Search = ""
  }
  var CurrentPage = req.params.id;
  var CurrentPage = parseInt(CurrentPage)

  if (searchtype == 'name') {
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where featname Ilike $1 ORDER BY featid asc limit 10 offset (($2- 1)*10);"
  } else if (searchtype == 'feat') {
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where feat Ilike $1 ORDER BY featid asc limit 10 offset (($2- 1)*10);"
  } else if (searchtype == 'reversefeat') {
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where reversefeat Ilike $1 ORDER BY featid asc limit 10 offset (($2- 1)*10);"
  } else if (searchtype == 'featgrade') {
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.featsup where featgrade Ilike $1 ORDER BY featid asc limit 10 offset (($2- 1)*10);"
  } else {
    res.redirect('/')
  }


  await client.query(QueryString, ['%' + Search + '%', CurrentPage], async function(err, response) {
    await response;
    if (typeof(response.rows[0]) !== "object") {
      var TotalCount = 1;
    } else {
      var TotalCount = response.rows[0].totalcount;
    }
    var DataCountInPage = 10;
    var PageSize = 10;
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

    res.render('featsup', {
      title: 'AAF 장비',
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

})





module.exports = router;
