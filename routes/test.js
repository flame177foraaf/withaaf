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

  var QueryString = "SELECT * FROM aquafeq.Dungeon order by id asc"
  client.query(QueryString, (err,response) => {
    res.render('test', {
    title:'AAF 던전 몬스터 정보',
    fieldname:'검색이 필요합니다',

    data:response.rows,
    Data_length:Data_length,
    });
  });
});
//  var QueryString = "SELECT * FROM aquafeq.monster where mon_property Ilike $1;"
//  var QueryString = "select * from aquafeq.field inner join aquafeq.monster on aquafeq.field.field_id =  aquafeq.monster.mon_field where aquafeq.monster.mon_property Ilike $1 order by aquafeq.field.field_id, aquafeq.monster.mon_lv;"
// var QueryString = "select (ROW_NUMBER() over()) as num, (select count (DISTINCT field_id) from aquafeq.field  as t1 inner join aquafeq.monster as t2 on t1.field_id =  t2.mon_field where t2.mon_property Ilike $1), * from aquafeq.field  as t1 inner join aquafeq.monster as t2 on t1.field_id =  t2.mon_field where t2.mon_property Ilike $1 order by field_id, mon_lv;"

// var QueryString = "SELECT * FROM aquafeq.monster where mon_name Ilike $1"




router.get('/search', (req,res,next) => {
  var SearchingType = req.query.SearchType;
  var SearchingText = req.query.SearchText;
  if (SearchingType === 'name'){
    // var FieldNum = req.params.id;
    var QueryString = "select (ROW_NUMBER() over()) as num, (select count (DISTINCT field_id) as searchcount from aquafeq.field  as t1 inner join aquafeq.monster as t2 on t1.field_id =  t2.mon_field  where t2.mon_name Ilike $1), * from aquafeq.field  as t1 inner join aquafeq.monster as t2 on t1.field_id =  t2.mon_field where t2.mon_name Ilike $1 order by field_id, mon_lv;"
    client.query(QueryString, ['%' + SearchingText + '%'], (err,response) => {
      console.log(SearchingText)
      console.log(typeof(SearchingType))
      console.log('데이터 길이' + response.rows.length)
      var Data_length = response.rows.length;
      console.log('첫 데이터' + response.rows[0])
      if (typeof(response.rows[0]) !== 'object') {
        res.redirect('/test')

      }

      var Data_length = response.rows.length;
        res.render('test', {
        title:'AAF 던전 몬스터 정보',
        data:response.rows,
        SearchingText:SearchingText,
        Data_length:Data_length,
      });
    });
  } else  if (SearchingType === 'property'){
    // var FieldNum = req.params.id;
    var QueryString = "select (ROW_NUMBER() over()) as num, * from aquafeq.field  as t1 inner join aquafeq.monster as t2 on t1.field_id =  t2.mon_field where t2.mon_property Ilike $1 order by field_id, mon_lv;;"
    client.query(QueryString, ['%' + SearchingText + '%'], (err,response) => {
      console.log(SearchingText)
      console.log(typeof(SearchingType))
      console.log('데이터 길이' + response.rows.length)
      var Data_length = response.rows.length;
      console.log('첫 데이터' + response.rows[0])
      if (typeof(response.rows[0]) !== 'object') {
        res.redirect('/test')

      }

      var Data_length = response.rows.length;
      res.render('test', {
        title:'AAF 던전 몬스터 정보',
        data:response.rows,
        SearchingText:SearchingText,
        Data_length:Data_length,

      });
    });
  } else if (SearchingType === 'type'){
    var QueryString = "select (ROW_NUMBER() over()) as num, * from aquafeq.field  as t1 inner join aquafeq.monster as t2 on t1.field_id =  t2.mon_field where t2.mon_type Ilike $1 order by field_id, mon_lv;;"
    client.query(QueryString, ['%' + SearchingText + '%'], (err,response) => {
      console.log(SearchingText)
      console.log(typeof(SearchingType))
      console.log('데이터 길이' + response.rows.length)
      var Data_length = response.rows.length;
      console.log('첫 데이터' + response.rows[0])
      if (typeof(response.rows[0]) !== 'object') {
        res.redirect('/test')

      }

      var Data_length = response.rows.length;

      res.render('test', {
        title:'AAF 던전 몬스터 정보',
        data:response.rows,
        SearchingText:SearchingText,
        Data_length:Data_length,

      });
    });

  } else if (SearchingType === 'collect') {
    var QueryString = "select * from aquafeq.field as t1 inner join aquafeq.monster as t2 on t1.field_id = t2.mon_field where t2.mon_common Ilike $1 or t2.mon_uncommon Ilike $1 or t2.mon_rare Ilike $1 order by field_id,mon_lv;"
    client.query(QueryString, ['%' + SearchingText + '%'], (err,response) => {
      console.log(SearchingText)
      console.log(typeof(SearchingType))
      console.log('데이터 길이' + response.rows.length)
      var Data_length = response.rows.length;
      console.log('첫 데이터' + response.rows[0])
      if (typeof(response.rows[0]) !== 'object') {
        res.redirect('/test')

      }

      var Data_length = response.rows.length;

      res.render('test', {
        title:'AAF 던전 몬스터 정보',
        data:response.rows,
        SearchingText:SearchingText,
        Data_length:Data_length,

      });
    });
  }
});

// params.id 를 쓰는 라우터는 마지막에 쓰라고 한다
router.get('/:id', (req,res,next) => {
  var Field_Id = req.params.id;
    var QueryString = "SELECT * FROM aquafeq.monster where mon_field = $1"
    client.query(QueryString, [Field_Id], (err,response) => {
      if (typeof(response.rows[0]) !== 'object') {
        res.redirect('/test')

      }
      var Data_length = response.rows.length;
      if (Field_Id == "90") {
        res.render('monster_top', {
          title:'AAF 던전 몬스터 정보',
          data:response.rows,
          Data_length:Data_length,
        });
      } else {
        res.render('test', {
          title:'AAF 던전 몬스터 정보',
          data:response.rows,
          Data_length:Data_length,
        });
      }


    });
 //else if (Searchingtype === 'property') {

  //} else if (Searchingtype === 'type') {

  //} else if (Searchingtype === 'collect') {

  //}

});



module.exports = router;
