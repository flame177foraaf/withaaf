var express = require('express');
var router = express.Router();
var app = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();



router.get('/',  (req, res, next) => {
  if(req.query.searchType === 'number') {
    var search = req.query.searchText;
    var { rows } = await client.query("SELECT * FROM aquafeq.aquafrecipe WHERE collectnum LIKE $1 OR collect1num LIKE $1 OR collect2num LIKE $1 OR collect3num LIKE $1 OR collect4num LIKE $1 OR collect5num LIKE $1 OR collect6num LIKE $1", ['%' + search + '%'], (err, response) => {
      res.render('recipe', {
        title: '레시피',
        data: response.rows
      });
    });
  } else if (req.query.searchType === 'name') {
    var search = req.query.searchText;
    var { rows } = await client.query("SELECT * FROM aquafeq.aquafrecipe WHERE collectname LIKE $1 OR collect1name LIKE $1 OR collect2name LIKE $1 OR collect3name LIKE $1 OR collect4name LIKE $1 OR collect5name LIKE $1 OR collect6name LIKE $1", ['%' + search + '%'], (err, response) => {
      res.render('recipe', {
        title: '레시피',
        data: response.rows
      });
    });
  } else {
    res.render('recipemain', {
      title: '레시피',
    });
  }
});



module.exports = router;
