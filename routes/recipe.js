var express = require('express');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());
var app = express();
var url = require('url');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();

router.get('/', async function(req,res,next) {
  res.render('recipe', {
    title:'AAF 레시피'
  });
});

router.get('/fixrecipe', async function(req,res,next) {
  var QueryString = "select recipenum from aquafeq.aquafrecipe";
  await client.query(QueryString, async function (err, response){
    var SeachRecipeNum = req.query.SeachNum;
    var QueryString = "select * from aquafeq.aquafrecipe where recipenum = $1";
    await client.query(QueryString, [SeachRecipeNum], async function (err, response){
      await response;

      res.render ('fixrecipe', {
        title:SeachRecipeNum + ' 번 레시피 수정',
        data:response.rows[0]
      });
    });
  });
});

router.post('/fixrecipe', async function(req,res,next) {
  var RecipeN = req.body.recipenum;
  //req.body.name ... id와 항상 헷갈리지 말자 ㅠㅠ

  var Collectname = req.body.collectname;

  var Collectnum = req.body.collectnum;

  var Collect1name = req.body.collect1name;
  var Collect2name = req.body.collect2name;
  var Collect3name = req.body.collect3name;
  var Collect4name = req.body.collect4name;
  var Collect5name = req.body.collect5name;
  var Collect6name = req.body.collect6name;
  var Collect1num = req.body.collect1num;
  var Collect2num = req.body.collect2num;
  var Collect3num = req.body.collect3num;
  var Collect4num = req.body.collect4num;
  var Collect5num = req.body.collect5num;
  var Collect6num = req.body.collect6num;
  var Collect1unit = req.body.collect1unit;
  var Collect2unit = req.body.collect2unit;
  var Collect3unit = req.body.collect3unit;
  var Collect4unit = req.body.collect4unit;
  var Collect5unit = req.body.collect5unit;
  var Collect6unit = req.body.collect6unit;


  var QueryString = "UPDATE aquafeq.aquafrecipe SET (collectnum,   collectname,  collect1num,  collect1name,  collect1unit,  collect2num,  collect2name,  collect2unit,  collect3num,  collect3name,  collect3unit,  collect4num,  collect4name,  collect4unit,  collect5num,  collect5name,  collect5unit,  collect6num,  collect6name,  collect6unit) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20 )  WHERE recipenum = $21 returning *";
  //client.query("UPDATE aquafeq.aquafwp SET wpgrade = Wpgrade, wplimit =Wplimit, wpsocket=Wpsocket, wpether=Wpether, wpstats=Wpstats, wpproperty=Wpproperty, wpfeat=Wpfeat, wpcustom=Wpcustom, wpup=Wpup  WHERE wpname = Wpname ",  (err, response) => {
    await client.query(QueryString, [Collectnum, Collectname, Collect1num, Collect1name,   Collect1unit, Collect2num,   Collect2name,   Collect2unit, Collect3num, Collect3name,  Collect3unit, Collect4num, Collect4name,  Collect4unit, Collect5num,  Collect5name,  Collect5unit, Collect6num, Collect6name,Collect6unit, RecipeN], async function (err, response){

    var QueryString = "select * from aquafeq.aquafrecipe where recipenum = $1";
    await client.query ( QueryString, [RecipeN], async function(err, response) {
      await response;
      console.log('쿼리스트링' + QueryString);
      res.render('recipe', {
        title : RecipeN + ' 번 레시피 수정 완료',
        data: response.rows
      });
    });
  });
});


router.get('/:id', async function(req,res,next) {
  var searchtype = req.query.searchtype;
  var Search = req.query.searchtext;
  if (Search == null ) {
    var Search = "";
  }
  var CurrentPage = req.params.id;
  var CurrentPage = parseInt(CurrentPage);
  var QueryString;
  if (searchtype == 'name') {
    var QueryString = "SELECT *, count(*) over() as totalcount FROM  aquafeq.aquafrecipe WHERE collectname Ilike '%' || $1 || '%' OR collect1name Ilike '%' || $1 || '%' OR collect2name Ilike '%' || $1 || '%' OR collect3name Ilike '%' || $1 || '%' OR collect4name Ilike '%' || $1 || '%' OR collect5name Ilike '%' || $1 || '%' OR collect6name Ilike '%' || $1 || '%' ORDER BY recipenum asc limit 20 offset (($2- 1)*20);";
  } else if (searchtype == 'number') {
    var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafrecipe WHERE collectnum = $1 OR collect1num = $1 OR collect2num = $1 OR collect3num = $1 OR collect4num = $1 OR collect5num = $1 OR collect6num = $1 ORDER BY recipenum asc limit 20 offset (($2- 1)*20);";
  } else {
    res.redirect('/');
  }
  await client.query(QueryString, [Search,  CurrentPage], async function (err, response){
    await response;
    var TotalCount;
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      if(typeof(response.rows[0]) !== "object") {
          var TotalCount = 1;
      } else {
        var TotalCount = response.rows[0].totalcount;
      }
      var DataCountInPage = 20;
      var PageSize = 10;
      var TotalPage = parseInt(TotalCount / DataCountInPage,10);
      if (TotalCount % DataCountInPage > 0) {
        TotalPage++;
      }

      if (TotalPage < CurrentPage) {
        CurrentPage = TotalPage;
      }
      var StartPage = parseInt(((CurrentPage - 1)/10),10) *10 +1;
      var EndPage = StartPage + PageSize -1;
      if (EndPage > TotalPage) {
        EndPage = TotalPage;
      }
      res.render('recipe', {
          title: 'AAF 레시피',
          data: response.rows,
          CurrentPage: CurrentPage,
          PageSize: PageSize,
          StartPage: StartPage,
          EndPage: EndPage,
          TotalPage: TotalPage,
          searchtype: encodeURIComponent(searchtype),
          Search: encodeURIComponent(Search),
      });
    }
  });

});




module.exports = router;
