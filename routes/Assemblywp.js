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
  var Assembly = req.query.assemble;
  console.log(req.query.assemble);
  console.log(Assembly);

  var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = $1;"
  client.query(QueryString, [Assembly],(err, response) => {
    res.render('Assemblywp', {
      title: '무기 재조립하기',
      data: response.rows[0]
    });
  });
});

router.post('/ing', (req,res,next) => {

  var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = $1;"
  client.query(QueryString, [Assembly],(err, response) => {
    var Allcustom = response.rows[0].wpcustom;
    console.log(Allcustom);
    res.render('Assemblywp', {
      title: '무기 재조립하기',
      data: response.rows[0]
    });
  });

})


module.exports = router;
