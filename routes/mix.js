var express = require('express');
var router = express.Router();
var app = express();

var connection = require('../mypsql.js')
var bodyparser = require('body-parser');


;
var bodyparser = require('body-parser');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);




// GET home page.
router.get('/', (req, res, next) => {
  var sqlwp = 'SELECT * FROM aquafwp';
    connection.query(sqlwp, function(err, wpresults, field) {
      if (err) console.error(err);
      var sqlarm = 'SELECT * FROM aquafarm';
        connection.query(sqlarm, function(err, armresults, field) {
          if (err) console.error(err);
          var sqlacc = 'SELECT * FROM aquafacc';
            connection.query(sqlacc, function(err, accresults, field) {
              if (err) console.error(err);

              res.render('mix', {

                title: '회로 굴리기',
                varaquafwp: wpresults,
                varaquafarm: armresults,
                varaquafacc: accresults
              });
            });
        });
    });
});

console.log('asdf')

/*
  if(req.query.searchType === 'name') {
    var searchingtext = req.query.searchText
    var sqlwp = 'SELECT * FROM aquafwp WHERE wpname LIKE ?' ;
    connection.query(sqlwp, "%" + searchingtext + "%",function(err, results, field) {
      res.render('mix', {
        title: '회로굴리기',
        varmixwp: results
      });
    });
  } else {
    var sqlarm = 'SELECT * FROM aquafarm';
    connection.query(sqlarm, function(err, results, field) {
      res.render('mix')
    });

  }*/



module.exports = router;
