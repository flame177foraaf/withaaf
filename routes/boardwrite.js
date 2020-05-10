var express = require('express');
var router = express.Router();
var app = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();



router.get('/write', (req, res, next) => {
  res.render('boardwrite' ,{
    title: '글 작성하기'
  });
});

module.exports = router;
