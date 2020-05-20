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
  var QueryString = "select wpname from aquafeq.aquafwp"
  client.query(QueryString, (err, response) => {
    var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = $1"
    client.query(QueryString, [Assemble], (err, response) => {

      var Assemble = req.query.assemble;
      console.log(req.query.assemble);
      console.log(Assemble);
      res.render('testAssembly', {
        title: '무기 재조립하기',
        data: response.rows[0]
      });
    });
  })
});



module.exports = router;
