var express = require('express');
var router = express.Router();
/* GET helo page. */
router.get('/', function(req, res, next) {
  res.render('armadd',   {
    title: '방어구 추가하기',

    data:    {   }
  });
});


module.exports = router;
