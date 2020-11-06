var express = require('express');
var router = express.Router();
var app = express();
var url = require('url');

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
      res.render('monster', {
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
// var QueryString = "select (ROW_NUMBER() over()) as num, (select count (DISTINCT field_id) from aquafeq.field  as t1 inner join aquafeq.monster as t2 on t1.field_id =  t2.mon_field where t2.mon_property Ilike $1), * from aquafeq.field  as t1 inner join aquafeq.monster as t2 on t1.field_id =  t2.mon_field where t2.mon_property Ilike $1 order by field_id, mon_lv;"

// var QueryString = "SELECT * FROM aquafeq.monster where mon_name Ilike $1"




router.get('/search', (req,res,next) => {
  var QueryString = "SELECT * FROM aquafeq.dungeon order by id asc"
  client.query(QueryString, (err,response) => {
    var QueryString = "SELECT  aquafeq.dungeon_partition.id, " + '"PartitionName"' + "," + '"FieldName"' + ",   part, COUNT(*) count   FROM aquafeq.dungeon_partition  inner join aquafeq.monster on aquafeq.monster.mon_field = aquafeq.dungeon_partition.part GROUP by  aquafeq.dungeon_partition.id, " + '"PartitionName"' + "," + '"FieldName"' + ",  part order by aquafeq.dungeon_partition.id;"


    client.query(QueryString, (err, response1) => {
      var SearchingType = req.query.SearchType;
      console.log(SearchingType)
      console.log(typeof(SearchingType))
      var SearchingText = req.query.SearchText;
      if (SearchingType === 'MonLvDown') {
        var SearchingType2 = req.query.SearchType2;
        var SearchingText2 = req.query.SearchText2;

        var SearchingText = parseInt(SearchingText)
        var SearchingText2 = parseInt(SearchingText2);
        if (typeof(SearchingType2) !== 'undefined') {
          var SearchingText2 = SearchingText2;
        } else {
          var SearchingText2 = 0;
          var SearchingText2 = parseInt(SearchingText2);
        }
        //var QueryString = "select * from aquafeq.dungeon_partition as t1 inner join aquafeq.monster as t2 on t1.part = t2.mon_field where (t2.mon_lv - ($1::INTEGER)) % ($2::INTEGER) = 0::INTEGER;";
        //console.log(QueryString)
        //console.log(SearchingText)
        //console.log(SearchingText2)
        //console.log(typeof(SearchingText))
        //console.log(typeof(SearchingText2))
        //client.query(QueryString, [SearchingText2, SearchingText ], (err,response3) => {
          console.log(QueryString)

          var QueryString = "select * from aquafeq.dungeon_partition as t1 inner join aquafeq.monster as t2 on t1.part = t2.mon_field where (t2.mon_lv - ($1::INTEGER)) % ($2::INTEGER) = 0::INTEGER order by t1.id;";

          client.query(QueryString, [SearchingText2, SearchingText], (err,response2) => {
            if (err) {
              console.log(err)
            }
            console.log(QueryString)
            var Data_length = response2.rows.length;

            res.render('monster', {
              Searching:'YES',
              SearchingType:SearchingType,
              title:'AAF 던전 몬스터 정보',
              data:response.rows,
              data_partition:response1.rows,

              data_monster:response2.rows,
              Data_length:Data_length,
            });
          });
        //});
      } else {
        if (SearchingType === 'name'){
          var QueryString = "select * from aquafeq.dungeon_partition  as t1 inner join aquafeq.monster as t2 on t1.part =  t2.mon_field where t2.mon_name Ilike $1 order by t1.id, mon_lv;"
        } else  if (SearchingType === 'property'){
          var QueryString = "select * from aquafeq.dungeon_partition  as t1 inner join aquafeq.monster as t2 on t1.part =  t2.mon_field where t2.mon_property Ilike $1 order by t1.id, mon_lv;;"
        } else if (SearchingType === 'type'){
          var QueryString = "select * from aquafeq.dungeon_partition  as t1 inner join aquafeq.monster as t2 on t1.part =  t2.mon_field where t2.mon_type Ilike $1 order by t1.id, mon_lv;"
        } else if (SearchingType === 'collect') {
          var QueryString = "select * from aquafeq.dungeon_partition  as t1 inner join aquafeq.monster as t2 on t1.part =  t2.mon_field where t2.mon_common Ilike $1 or t2.mon_uncommon Ilike $1 or t2.mon_rare Ilike $1 order by t1.id,mon_lv;"
        }
        client.query(QueryString, ['%' + SearchingText + '%'], (err,response2) => {
          if (err) {
            console.log(err)
          }
          console.log(QueryString)

          var Data_length = response2.rows.length;
          res.render('monster', {
            Searching:'YES',
            SearchingType:SearchingType,

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
      var Field_Id = parseInt(Field_Id)
      var QueryString = "SELECT * FROM aquafeq.monster as t1 left join aquafeq.dungeon_partition as t2 on t1.mon_field = t2.part where mon_field = $1 order by t1.mon_lv asc;"
      client.query(QueryString, [Field_Id], (err,response2) => {
        console.log(response2.rows[0])
        var Data_length = response2.rows.length;
          res.render('monster', {
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
