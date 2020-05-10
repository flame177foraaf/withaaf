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

router.get('/fixwp', (req,res,next) => {
  res.render('fixwp', {
    title:'AAF 장비'
  });
});

router.post('/', (req, res, next) => {

  var QueryString = "INSERT INTO aquafeq.aquafwp(wpgrade, wpname, wplimit, wpsocket, wpether, wpstats, wpproperty, wpfeat, wpcustom, wpup) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);"
  client.query(QueryString, [Wpgrade, Wpname, Wplimit, Wpsocket, Wpether, Wpstats, Wpproperty, Wpfeat, Wpcustom, Wpup], (err, response) => {
    console.log(Wpgrade);
    console.log(Wpname);
    if (err) {
      console.log('인서트 오류!')
      res.redirect('/test');
    } else {
      res.render('test', {
        title:'AAF 장비'
      });
    };
  });
});

module.exports = router;
