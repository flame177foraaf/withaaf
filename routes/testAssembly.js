var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();

router.get('/', (res,req,next) => {
  var Assemble = req.query.assemble_to_obj;
  console.log(req.query.assemble_to_obj);
  console.log(Assemble);


  var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = $1"
  client.query(QueryString, [Assemble], (err, response) => {
    res.render('testAssembly', {
      title: '무기 재조립하기',
      data: response.rows
    });
  });
});


module.exports = router;
