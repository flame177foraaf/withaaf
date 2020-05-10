var express = require('express');
var router = express.Router();
var app = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();





/* sql 테이블 랜더링 */
router.get('/',  (req, res, next) => {
  if(req.query.searchType === 'name') {
    var search = req.query.searchText;
    if (req.query.limit === 'over') {
      client.query("SELECT * FROM aquafeq.aquafwp WHERE wplimit >= 300 AND WPNAME LIKE $1" , ['%' + search +'%'], (err, response) =>
      res.render('aafwp', {
        title: '무기',
        data: response.rows
      });
    )
    } else {
      client.query("SELECT * FROM aquafeq.aquafwp WHERE wplimit < 300 AND WPNAME LIKE $1" , ['%' + search +'%'], (err, response) =>
      res.render('aafwp', {
        title: '무기',
        data: response.rows
      });
    }
  } else if (req.query.searchType === 'property') {
    client.query("SELECT * FROM aquafeq.aquafwp WHERE wpproperty LIKE $1", ['%' + search + '%'], (err, response) => {
      res.render('aafwp', {
        title: '무기',
        data: response.rows
      });
    });
  } else if (req.query.searchType === 'feat'){
    client.query("SELECT * FROM aquafeq.aquafwp WHERE wpfeat LIKE $1", ['%' + search + '%'], (err, response) => {
      res.render('aafwp', {
        title: '무기',
        data: response.rows
      });
    });
  } else if (req.query.searchType === 'custom'){
    var search = req.query.searchText;
    client.query("SELECT * FROM aquafeq.aquafwp WHERE wpcustom LIKE $1", ['%' + search + '%'], (err, response) => {
      res.render('aafwp', {
        title: '무기',
        data: response.rows
      });
    });
  } else {
    res.render('aafwpmain', {
      title: '무기',
    });
  }
});




module.exports = router;
