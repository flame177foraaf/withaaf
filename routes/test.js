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
  await res.render('test', {
    title: 'AAF 장비'
  });
});

router.get('/searchall',  async function  (req, res, next) {
  var Search = req.query.searchtext;
  var QueryString = "SELECT *, count(*) over() as totalcount FROM aquafeq.aquafrecipe WHERE collectname Ilike $1 OR collect1name Ilike $1 OR collect2name Ilike $1 OR collect3name Ilike $1 OR collect4name Ilike $1 OR collect5name Ilike $1 OR collect6name Ilike $1 ORDER BY recipenum asc;";

  var searchdataRecipe = [];

  // await client.query(QueryString, ['%' + Search + '%', ], function(err, response) {
  await client.query(QueryString, ['%' + Search + '%'], function async (err, response) {



           for (var i = 0; i < response.rows.length; i++) {

            row = response.rows[i];
            test = {};


          test['recipenum'] = rows.recipenum;
          test['collectnum'] = rows.collectnum;
          test['collectname'] = rows.collectname;


          test['collect1num'] = rows.collect1num;
          test['collect1name'] = rows.collect1name;
          test['collect1unit'] = rows.collect1unit;

          test['collect2num'] = rows.collect2num;
          test['collect2name'] = rows.collect2name;
          test['collect2unit'] = rows.collect2unit;


          test['collect3num'] = rows.collect3num;
          test['collect3name'] = rows.collect3name;
          test['collect3unit'] = rows.collect3unit;

          test['collect4num'] = rows.collect4num;
          test['collect4name'] = rows.collect4name;
          test['collect4unit'] = rows.collect4uni;


          test['collect5num'] = rows.collect5num;
          test['collect5name'] = rows.collect5name;
          test['collect5unit'] = rows.collect5unit;


          test['collect6num'] = rows.collect6num;
          test['collect6name'] = rows.collect6name;
          test['collect6unit'] = respoe.rows.collect6unit;

            searchdataRecipe.push(test);

          }
          console.log(searchdataRecipe)
    // searchdataRecipe['recipenum'] = response.rows.recipenum;
    // searchdataRecipe['collectnum'] = response.rows.collectnum;
    // searchdataRecipe['collectname'] = response.rows.collectname;
    //
    //
    // searchdataRecipe['collect1num'] = response.rows.collect1num;
    // searchdataRecipe['collect1name'] = response.rows.collect1name;
    // searchdataRecipe['collect1unit'] = response.rows.collect1unit;
    //
    // searchdataRecipe['collect2num'] = response.rows.collect2num;
    // searchdataRecipe['collect2name'] = response.rows.collect2name;
    // searchdataRecipe['collect2unit'] = response.rows.collect2unit;
    //
    //
    // searchdataRecipe['collect3num'] = response.rows.collect3num;
    // searchdataRecipe['collect3name'] = response.rows.collect3name;
    // searchdataRecipe['collect3unit'] = response.rows.collect3unit;
    //
    // searchdataRecipe['collect4num'] = response.rows.collect4num;
    // searchdataRecipe['collect4name'] = response.rows.collect4name;
    // searchdataRecipe['collect4unit'] = response.rows.collect4uni;
    //
    //
    // searchdataRecipe['collect5num'] = response.rows.collect5num;
    // searchdataRecipe['collect5name'] = response.rows.collect5name;
    // searchdataRecipe['collect5unit'] = response.rows.collect5unit;
    //
    //
    // searchdataRecipe['collect6num'] = response.rows.collect6num;
    // searchdataRecipe['collect6name'] = response.rows.collect6name;
    // searchdataRecipe['collect6unit'] = response.rows.collect6unit;


    // function async1() {
    //   return Promise.resolve(
    //     searchdataRecipe['collect1num'] = response.rows.collect1num,
    //     searchdataRecipe['collect1name'] = response.rows.collect1name,
    //     searchdataRecipe['collect1unit'] = response.rows.collect1unit
    //   );
    // }
    //
    // function async2() {
    //   return Promise.resolve(
    //     searchdataRecipe['collect2num'] = response.rows.collect2num,
    //     searchdataRecipe['collect2name'] = response.rows.collect2name,
    //     searchdataRecipe['collect2unit'] = response.rows.collect2unit
    //   );
    // }
    //
    // function async3() {
    //   return Promise.resolve(
    //     searchdataRecipe['collect3num'] = response.rows.collect3num,
    //     searchdataRecipe['collect3name'] = response.rows.collect3name,
    //     searchdataRecipe['collect3unit'] = response.rows.collect3unit
    //   );
    // }
    //
    // function async4() {
    //   return Promise.resolve(
    //     searchdataRecipe['collect4num'] = response.rows.collect4num,
    //     searchdataRecipe['collect4name'] = response.rows.collect4name,
    //     searchdataRecipe['collect4unit'] = response.rows.collect4unit
    //   );
    // }
    //
    // function async5() {
    //   return Promise.resolve(
    //     searchdataRecipe['collect5num'] = response.rows.collect5num,
    //     searchdataRecipe['collect5name'] = response.rows.collect5name,
    //     searchdataRecipe['collect5unit'] = response.rows.collect5unit);
    // }
    //
    // function async6() {
    //   return Promise.resolve(
    //     searchdataRecipe['collect6num'] = response.rows.collect6num,
    //     searchdataRecipe['collect6name'] = response.rows.collect6name,
    //     searchdataRecipe['collect6unit'] = response.rows.collect6unit);
    // }




    //console.log('엔드페이지'+ EndPage);
    //console.log(response.rows[0])
    await res.render('test', {
      title: 'AAF 장비',
      data: searchdataRecipe,



    });
  });


})



module.exports = router;
