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
  var QueryString = "SELECT * FROM aquafeq.aquafwp WHERE wpgrade ilike %세레스% "
  client.query(QueryString, (err, data1) => {
    if(typeof(data1.rows[0]) !== "object") {
      res.render('test', {
      data1: '자료가 없습니다.',
      });
    } else {
      res.render('test', {
      data1: data1.rows,
      });
    }


  })
});
//  var QueryString = "SELECT * FROM aquafeq.monster where mon_property Ilike $1;"
//  var QueryString = "select * from aquafeq.field inner join aquafeq.monster on aquafeq.field.field_id =  aquafeq.monster.mon_field where aquafeq.monster.mon_property Ilike $1 order by aquafeq.field.field_id, aquafeq.monster.mon_lv;"
// var QueryString = "select (ROW_NUMBER() over()) as num, (select count (DISTINCT field_id) from aquafeq.field  as table1 inner join aquafeq.monster as table2 on table1.field_id =  table2.mon_field where table2.mon_property Ilike $1), * from aquafeq.field  as table1 inner join aquafeq.monster as table2 on table1.field_id =  table2.mon_field where table2.mon_property Ilike $1 order by field_id, mon_lv;"

// var QueryString = "SELECT * FROM aquafeq.monster where mon_name Ilike $1"







module.exports = router;
