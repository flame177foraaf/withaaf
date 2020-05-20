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
  var Assemble = req.query.assemble;
  console.log(req.query.assemble);
  console.log(Assemble);

  var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = BWM 8S"
  client.query(QueryString, (err, response) => {
    res.render('testAssembly', {
      title: '무기 재조립하기',
      data: response.rows[0]
    });
  });
});



module.exports = router;
