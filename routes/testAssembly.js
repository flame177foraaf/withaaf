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

router.get('/', (req,res,next) => {
  var assembly = req.query.assembly;
  console.log(req.query.assembly);
  console.log(assembly);

  var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = $1;"
  client.query(QueryString, [assembly],(err, response) => {
    res.render('testAssembly', {
      title: '무기 재조립하기',
      data: response.rows[0]
    });
  });
});



module.exports = router;
