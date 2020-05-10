var express = require('express');
var router = express.Router();
/* GET helo page. */
router.get('/', function(req, res, next) {
  res.render('wpfind',   {
    title: '무기 추가하기',

    data:    {   }
  });
});


module.exports = router;
