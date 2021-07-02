var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var $ = require('jquery');
var url = require('url');
var asyncify = require('express-asyncify');



var router = asyncify(express.Router());


router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true , parameterLimit: 50000 }));


const client = require('../config/dbconfig.js');




router.get('/', async function(req, res, next) {
  res.render('mylist', {
    title: 'AAF 나의 수집품'
  });
});



module.exports = router;
