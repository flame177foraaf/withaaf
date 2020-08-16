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
  var Search = req.params.id;
  console.log(Search)

  var QueryString = "select rival_name from aquafeq.rival where rival_grade like '%일반%'"
  client.query(QueryString, (err, response1) =>{
    var QueryString = "select rival_name from aquafeq.rival where rival_grade like '%희귀 강적%'"
    client.query(QueryString, (err, response2) =>{
      var QueryString = "select rival_name from aquafeq.rival where rival_grade like '%대강적%'"
      client.query(QueryString, (err, response3) =>{
        res.render('test' , {
          Rival: Search,

          list1: response1.rows,
          list2: response2.rows,
          list3: response3.rows,
        })
      })
    })
  })
})


router.get('/:id' , (req,res,next) => {
  var Search = req.params.id;
  console.log(Search);
  if (Search === '천룡왕') {
    Search = '희귀 강적 천룡왕'
  }
  var QueryString = "select rival_name from aquafeq.rival where rival_grade like '%일반%'"
  client.query(QueryString, (err, response1) =>{
    var QueryString = "select rival_name from aquafeq.rival where rival_grade like '%희귀 강적%'"
    client.query(QueryString, (err, response2) =>{
      var QueryString = "select rival_name from aquafeq.rival where rival_grade like '%대강적%'"
      client.query(QueryString, (err, response3) =>{
        var QueryString = 'SELECT * FROM aquafeq.rival where rival_information like $1';
        client.query( QueryString, ['%' + Search + '%'], (err, rival_information) => {
          var QueryString = 'SELECT * FROM aquafeq.aquafwp where wpgrade like $1';
          client.query( QueryString, ['%' + Search + '%'], (err, data1) => {
            var QueryString = 'SELECT * FROM aquafeq.aquafarm where armgrade like $1';
            client.query( QueryString, ['%' + Search + '%'], (err, data2) => {

                var QueryString = 'SELECT * FROM aquafeq.featsup where featgrade like $1';
                if (Search.indexOf('사흑천') === -1 ) {
                  var QueryString = 'SELECT * FROM aquafeq.featsup where featgrade like %사흑천%';
                }

                client.query( QueryString, ['%' + Search + '%'], (err, data4) => {
                  var QueryString = 'SELECT * FROM aquafeq.aquafgem where collectname like $1';
                  client.query( QueryString, ['%' + Search + '%'], (err, data5) => {
                    res.render('test' , {
                      list1: response1.rows,
                      list2: response2.rows,
                      list3: response3.rows,

                      Rival: Search,

                      rival_information:rival_information.rows,
                      data1: data1.rows,
                      data2: data2.rows,
                      data4: data4.rows,
                      data5: data5.rows,
                    })

                  })

                })


            })

          })

        })
      })
    })
  })


})
/*
router.get('/', (req,res,next) => {
  var Data_length = 0;
  var QueryString = "SELECT * FROM aquafeq.aquafwp WHERE wpgrade ilike $1 "
  client.query(QueryString, ['%' + '세레스' + '%'], (err, data1) => {
    var QueryString = "SELECT * FROM aquafeq.aquafarm WHERE armgrade ilike $1 "
    client.query(QueryString, ['%' + '세레스' + '%'], (err, data2) => {
      var QueryString = "SELECT * FROM aquafeq.aquafacc WHERE accgrade ilike $1 "
      client.query(QueryString, ['%' + '세레스' + '%'], (err, data3) => {
        var QueryString = "SELECT * FROM aquafeq.featsup WHERE featgrade ilike $1 "
        client.query(QueryString, ['%' + '세레스' + '%'], (err, data4) => {
          var QueryString = "SELECT * FROM aquafeq.aquafgem WHERE collectname ilike $1 "
          client.query(QueryString, ['%' + '세레스' + '%'], (err, data5) => {

            if (err) {
              console.log(err);
            } else {
              res.render('test', {
                data1: data1.rows,
                data2: data2.rows,
                data3: data3.rows,
                data4: data4.rows,
                data5: data5.rows,
              });
            }
          })
        })
      })
    })
  })
});
*/


//  var QueryString = "SELECT * FROM aquafeq.monster where mon_property Ilike $1;"
//  var QueryString = "select * from aquafeq.field inner join aquafeq.monster on aquafeq.field.field_id =  aquafeq.monster.mon_field where aquafeq.monster.mon_property Ilike $1 order by aquafeq.field.field_id, aquafeq.monster.mon_lv;"
// var QueryString = "select (ROW_NUMBER() over()) as num, (select count (DISTINCT field_id) from aquafeq.field  as table1 inner join aquafeq.monster as table2 on table1.field_id =  table2.mon_field where table2.mon_property Ilike $1), * from aquafeq.field  as table1 inner join aquafeq.monster as table2 on table1.field_id =  table2.mon_field where table2.mon_property Ilike $1 order by field_id, mon_lv;"

// var QueryString = "SELECT * FROM aquafeq.monster where mon_name Ilike $1"







module.exports = router;
