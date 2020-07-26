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
  var QueryString = "SELECT * FROM aquafeq.dungeon order by id asc"
  client.query(QueryString, (err,response) => {
    var QueryString = "SELECT * FROM aquafeq.dungeon_partition order by id asc"
    client.query(QueryString, (err, response1) => {
      res.render('test', {
      title:'AAF 던전 몬스터 정보',
      fieldname:'검색이 필요합니다',
      data:response.rows,
      data_partition:response1.rows,
      Data_length:Data_length,
      });
    })
  });
});
//  var QueryString = "SELECT * FROM aquafeq.monster where mon_property Ilike $1;"
//  var QueryString = "select * from aquafeq.field inner join aquafeq.monster on aquafeq.field.field_id =  aquafeq.monster.mon_field where aquafeq.monster.mon_property Ilike $1 order by aquafeq.field.field_id, aquafeq.monster.mon_lv;"
// var QueryString = "select (ROW_NUMBER() over()) as num, (select count (DISTINCT field_id) from aquafeq.field  as table1 inner join aquafeq.monster as table2 on table1.field_id =  table2.mon_field where table2.mon_property Ilike $1), * from aquafeq.field  as table1 inner join aquafeq.monster as table2 on table1.field_id =  table2.mon_field where table2.mon_property Ilike $1 order by field_id, mon_lv;"

// var QueryString = "SELECT * FROM aquafeq.monster where mon_name Ilike $1"




router.get('/search', (req,res,next) => {
  var QueryString = "SELECT * FROM aquafeq.dungeon order by id asc"
  client.query(QueryString, (err,response) => {
    var QueryString = "SELECT * FROM aquafeq.dungeon_partition order by id"
    client.query(QueryString, (err, response1) => {
      var SearchingType = req.query.SearchType;
      var SearchingText = req.query.SearchText;
      if (SearchingType === 'name'){
        // var FieldNum = req.params.id;
        var QueryString = "select (ROW_NUMBER() over()) as num, * from aquafeq.dungeon_partition  as table1 inner join aquafeq.monster as table2 on table1.part =  table2.mon_field where table2.mon_name Ilike $1 order by table1.id, mon_lv;"
        client.query(QueryString, ['%' + SearchingText + '%'], (err,response2) => {
          var Data_length = response2.rows.length;
            console.log(response2.rows[0])
          res.render('test', {
            Searching:'YES',
            title:'AAF 던전 몬스터 정보',
            data:response.rows,
            data_partition:response1.rows,
            data_monster:response2.rows,
            Data_length:Data_length,
          });
        });
      } else  if (SearchingType === 'property'){
        // var FieldNum = req.params.id;
        var QueryString = "select (ROW_NUMBER() over()) as num, * from aquafeq.dungeon_partition  as table1 inner join aquafeq.monster as table2 on table1.part =  table2.mon_field where table2.mon_property Ilike $1 order by table1.id, mon_lv;;"
        client.query(QueryString, ['%' + SearchingText + '%'], (err,response2) => {
          var Data_length = response2.rows.length;
            console.log(response2.rows[0])
          res.render('test', {
            Searching:'YES',
            title:'AAF 던전 몬스터 정보',
            data:response.rows,
            data_partition:response1.rows,
            data_monster:response2.rows,
            Data_length:Data_length,
          });
        });
      } else if (SearchingType === 'type'){
        var QueryString = "select (ROW_NUMBER() over()) as num, * from aquafeq.dungeon_partition  as table1 inner join aquafeq.monster as table2 on table1.part =  table2.mon_field where table2.mon_type Ilike $1 order by table1.id, mon_lv;"
        client.query(QueryString, ['%' + SearchingText + '%'], (err,response2) => {
          var Data_length = response2.rows.length;
            console.log(response2.rows[0])
          res.render('test', {
            Searching:'YES',
            title:'AAF 던전 몬스터 정보',
            data:response.rows,
            data_partition:response1.rows,
            data_monster:response2.rows,
            Data_length:Data_length,
          });
        });

      } else if (SearchingType === 'collect') {
        var QueryString = "select (ROW_NUMBER() over()) as num, * from aquafeq.dungeon_partition  as table1 inner join aquafeq.monster as table2 on table1.part =  table2.mon_field where table2.mon_common Ilike $1 or table2.mon_uncommon Ilike $1 or table2.mon_rare Ilike $1 order by table1.id,mon_lv;"
        client.query(QueryString, ['%' + SearchingText + '%'], (err,response2) => {
          var Data_length = response2.rows.length;
            console.log(response2.rows[0])
          res.render('test', {
            Searching:'YES',
            title:'AAF 던전 몬스터 정보',
            data:response.rows,
            data_partition:response1.rows,
            data_monster:response2.rows,
            Data_length:Data_length,
          });
        });
      }
    })
  });

});

// params.id 를 쓰는 라우터는 마지막에 쓰라고 한다
router.get('/:id', (req,res,next) => {
  var QueryString = "SELECT * FROM aquafeq.dungeon order by id asc"
  client.query(QueryString, (err,response) => {
    var QueryString = "SELECT * FROM aquafeq.dungeon_partition order by id"
    client.query(QueryString, (err, response1) => {
      var Field_Id = req.params.id;
      var QueryString = "SELECT * FROM aquafeq.monster as table1 left join aquafeq.dungeon_partition as table2 on table1.mon_field = table2.part where mon_field = $1 order by table1.mon_lv asc;"
      client.query(QueryString, [Field_Id], (err,response2) => {
        console.log(response2.rows[0])
        var Data_length = response2.rows.length;
        res.render('test', {
          Field_Id:Field_Id,
          title:'AAF 던전 몬스터 정보',
          fieldname:'검색이 필요합니다',
          data:response.rows,
          data_partition:response1.rows,
          data_monster:response2.rows,
          Data_length:Data_length,
        });
      });
    })
  });
});



module.exports = router;
