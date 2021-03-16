var express = require('express');
var router = express.Router();


var app = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
  rejectUnauthorized: false
},
});

client.connect();



/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', {
    title: '메인화면'

  });
});


/*
router.get('/login', function(req,res){
  res.render('login',{page:"login"})
});

router.get('/signup', function(req,res) {
  res.render('signup',{page:"signup"})
})

*/



/* GET home page. */
module.exports = router;
