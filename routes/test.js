var express = require('express');
var app = express();
var $ = require('jquery');
var url = require('url');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());
var {
  Client
} = require('pg');
var client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();


router.get('/', async function(req, res, next) {
  res.render('test', {
    title: '테스트'
  });
});

router.get('/searchall', async function(req, res, next) {
  var Search = req.query.searchtext;
  console.log(Search)
  var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafrecipe WHERE collectname Ilike $1 OR collect1name Ilike $1 OR collect2name Ilike $1 OR collect3name Ilike $1 OR collect4name Ilike $1 OR collect5name Ilike $1 OR collect6name Ilike $1 ORDER BY recipenum asc;";
  console.log(QueryString)

  // await client.query(QueryString, ['%' + Search + '%', ], function(err, response) {
  await client.query(QueryString, ['%' + Search + '%'], function(err, dataRecipe) {


    res.render('test', {
      title: 'AAF 장비',
      dataRecipe: dataRecipe.rows,



    });
  });


})



module.exports = router;
