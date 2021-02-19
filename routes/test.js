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
      var QueryString = "SELECT * FROM aquafeq.aquafrecipe WHERE collectname Ilike $1 OR collect1name Ilike $1 OR collect2name Ilike $1 OR collect3name Ilike $1 OR collect4name Ilike $1 OR collect5name Ilike $1 OR collect6name Ilike $1 ORDER BY recipenum asc;";
      await client.query(QueryString, ['%' + Search + '%'], async function(err, dataRecipe) {

          var QueryString = " Select * From aquafeq.aquafwp WHERE wpup Ilike $1 ORDER BY wpid ;";
          await client.query(QueryString, ['%' + Search + '%'], async function(err, dataWP) {

              var QueryString = " Select * From aquafeq.aquafarm WHERE armup Ilike $1 ORDER BY armid ;";
              await client.query(QueryString, ['%' + Search + '%'], async function(err, dataARM) {

                  var QueryString = " Select * From aquafeq.aquafacc WHERE accup Ilike $1 ORDER BY accid ;";
                  await client.query(QueryString, ['%' + Search + '%'], async function(err, dataACC) {

                      var QueryString = "select * from aquafeq.monster where mon_common Ilike $1 or mon_uncommon Ilike $1 or mon_rare Ilike $1 AND mon_field not Ilike '%Tower%'  order by mon_lv;";
                      await client.query(QueryString, ['%' + Search + '%'], async function(err, dataMonsterField) {


                          var QueryString = "select * from aquafeq.monster where mon_common Ilike $1 or mon_uncommon Ilike $1 or mon_rare Ilike $1  AND mon_field Ilike '%Tower%' order by mon_lv;";
                          await client.query(QueryString, ['%' + Search + '%'], function(err, dataMonsterTower) {

                            res.render('test', {
                              title: 'AAF 장비',
                              dataRecipe: dataRecipe.rows,
                              dataWP: dataWP.rows,
                              dataARM: dataARM.rows,
                              dataACC: dataACC.rows,
                              dataMonsterField: dataMonsterField.rows,
                              dataMonsterTower: dataMonsterTower.rows,

                            });
                          })


                        })


                      });
                  });

              });

          });


      });



    module.exports = router;
