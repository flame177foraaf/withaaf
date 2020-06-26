var express = require('express');
var router = express.Router();
var app = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();



router.get('/',  (req, res, next) => {
  if(req.query.searchType === 'number') {
    var search = req.query.searchText;
    var { rows } = await client.query("SELECT * FROM aquafeq.aquafrecipe WHERE collectnum Ilike $1 OR collect1num Ilike $1 OR collect2num Ilike $1 OR collect3num Ilike $1 OR collect4num Ilike $1 OR collect5num Ilike $1 OR collect6num Ilike $1", ['%' + search + '%'], (err, response) => {
      res.render('recipe', {
        title: '레시피',
        data: response.rows
      });
    });
  } else if (req.query.searchType === 'name') {
    var search = req.query.searchText;
    var { rows } = await client.query("SELECT * FROM aquafeq.aquafrecipe WHERE collectname Ilike $1 OR collect1name Ilike $1 OR collect2name Ilike $1 OR collect3name Ilike $1 OR collect4name Ilike $1 OR collect5name Ilike $1 OR collect6name Ilike $1", ['%' + search + '%'], (err, response) => {
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
