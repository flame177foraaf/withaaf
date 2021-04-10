var express = require('express');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());
var app = express();
var bodyParser = require('body-parser');

const client = require('../config/dbconfig.js');



router.get('/', (req,res, next) => {
  var psql = "SELECT * FROM aquafeq.freeboard ORDER BY developid DESC"
  client.query(psql, function (err, response){
    res.render('developboard', {
      title: '개발일지',
      data: response.rows
    });
  });
});


router.get('/:id', async function(req,res,next) {
  var id = req.params.id;
  client.query("SELECT developid, developproject, developcontent FROM aquafeq.developboard WHERE developid=$1", [id], function (err, response){
    res.render('showdevelop', {
      data: response.rows[0]
    });
  });
});


=if(B5="",if(B6="",TRANSPOSE(A6:if(B6="",if(B7="",if(B8="",if(B9="",if(B10="",IF(B11="",IF(B12="",IF(B13="",IF(B14="",IF(B15="",IF(B16="",IF(B17="",IF(B18="",IF(B19="",IF(B20="",A20,A19),A18),A17),A16),A15),A14),A13),A12),A11),A10),A9),A8),A7),A6),A6)),))

router.post('/', async function(req,res,next) {
  client.query("INSERT INTO aquafeq.developboard(developid, developproject, developcontent) values ($1, $2, $3, to_char(now(),'YYYY-MM-DD'))", [req.body.title, req.body.boardbody, req.body.writer], function (err, response){
    console.log(req.body.title);
    console.log(req.body.boardbody);
    console.log(req.body.writer);
    if (err) {
      console.error();
    } else {
      var psql = "SELECT * FROM aquafeq.freeboard"
      client.query(psql, function (err, response){
        res.redirect('/board')
      });
    };
  });
});

module.exports = router;
