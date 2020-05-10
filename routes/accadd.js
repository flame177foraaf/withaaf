var express = require('express');
var router = express.Router();
/* GET helo page. */
router.get('/', function(req, res, next) {
  res.render('accadd',   {
    title: '악세사리 추가하기',

    data:    {   }
  });
});


module.exports = router;
