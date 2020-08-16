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
//  var QueryString = "SELECT * FROM aquafeq.monster where mon_property Ilike $1;"
//  var QueryString = "select * from aquafeq.field inner join aquafeq.monster on aquafeq.field.field_id =  aquafeq.monster.mon_field where aquafeq.monster.mon_property Ilike $1 order by aquafeq.field.field_id, aquafeq.monster.mon_lv;"
// var QueryString = "select (ROW_NUMBER() over()) as num, (select count (DISTINCT field_id) from aquafeq.field  as table1 inner join aquafeq.monster as table2 on table1.field_id =  table2.mon_field where table2.mon_property Ilike $1), * from aquafeq.field  as table1 inner join aquafeq.monster as table2 on table1.field_id =  table2.mon_field where table2.mon_property Ilike $1 order by field_id, mon_lv;"

// var QueryString = "SELECT * FROM aquafeq.monster where mon_name Ilike $1"







module.exports = router;
