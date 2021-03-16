var express = require('express');
var app = express();
var $ = require('jquery');
var url = require('url');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();

router.get('/', async function(req,res,next) {
  res.render('aafgem', {
    title:'AAF 장비',
  });
});

router.get('/fixgem', async function(req,res,next) {
  var QueryString = "select gemname from aquafeq.aquafgem"
  await client.query(QueryString, async function (err, response){
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafgem where gemname = $1"
    await client.query(QueryString, [Select_name], async function (err, response){
      await  response;
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

router.post('/fixgem', async function(req,res,next) {
  var Eqid = req.body.eqid;
  console.log(Eqid)

  console.log(Eqid)

  var Gemgrade =req.body.grade;
    if (Gemgrade !== '') {
      Gemgrade = Gemgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var Collectname = req.body.name;
  var Gemname = req.body.gemname;
  var Gemobject =req.body.obj;
  var Gemeffect = req.body.effect;
    if (Gemeffect !== '') {
      Gemeffect = Gemeffect.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
  var QueryString = "UPDATE aquafeq.aquafgem SET (gemgrade, collectname, gemobject, gemeffect, gemname) = ($1, $2, $3, $4, $5)  WHERE gemid = $6 returning *"
  await client.query(QueryString, [Gemgrade, Collectname, Gemobject, Gemeffect, Gemname, Eqid], async function (err, response){
    var QueryString = "select * from aquafeq.aquafgem where gemname = $1"
    await client.query (QueryString, [Gemname],  async function(err, response) {
      await response;
      console.log(response.rows[0])
      res.render('aafgem', {
        title : Gemname + ' 변경 완료',
        data: response.rows
      })
    });
  });
})



router.get('/add_gem', async function(req,res,next) {
  res.render('addgem', {
    title:'AAF 장비'
  });
})


router.post('/add_gem', async function(req,res,next) {
  var Gemgrade =req.body.grade;
  if (Gemgrade !== '') {
    Gemgrade = Gemgrade.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var Collectname = req.body.name;
  var Gemname = req.body.gemname;
  var Gemobject =req.body.obj;
  var Gemeffect = req.body.effect;
  if (Gemeffect !== '') {
    Gemeffect = Gemeffect.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  var QueryString = "INSERT INTO aquafeq.aquafgem(gemgrade, collectname, gemname, gemobject, gemeffect) values ($1, $2, $3, $4, $5);"
  await client.query(QueryString, [Gemgrade, Collectname, Gemname, Gemobject, Gemeffect], async function (err, response){
    var QueryString = "select gemid, gemname from aquafeq.aquafgem where gemname = Gemname ORDER BY gemid asc ;"
    await client.query(QueryString, async function (err, response){
      await response;
      res.render('aafgem', {
        title:'AAF 루엘',
        data:response.rows
      });
    });
  });
})



router.get('/:id', async function(req,res,next) {
  var searchtype = req.query.searchtype;
  var Search = req.query.searchtext;
  if (Search == null ) {
    var Search = ""
  }
  var CurrentPage = req.params.id;
  var CurrentPage = parseInt(CurrentPage)

  if (searchtype == 'name') {
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.aquafgem where collectname Ilike $1 ORDER BY gemid asc limit 10 offset (($2- 1)*10);"
  } else if (searchtype == 'effect') {
    var QueryString = "SELECT *, count(*) over() as totalcount, row_number(*) over() FROM aquafeq.aquafgem where gemeffect Ilike $1 ORDER BY gemid asc limit 10 offset (($2- 1)*10);"
  } else {
    res.redirect('/')
  }

  await client.query(QueryString, ['%' + Search + '%', CurrentPage], async function (err, response){
    await response;
    if (err) {
      console.log(err)
      res.redirect('/')
    }

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
      searchtype: encodeURIComponent(searchtype),
      Search: encodeURIComponent(Search),
    });
  });
});




module.exports = router;
