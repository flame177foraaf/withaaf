var express = require('express');
var app = express();
var $ = require('jquery');
var url = require('url');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());


const client = require('../config/dbconfig.js');




router.get('/', async function(req, res, next) {
  res.render('test', {
    title: 'AAF 테스트'
  });
});

router.post('/ing', async function(req, res, next) {
  console.log('here');
  var testcontent = req.body.content;
  console.log(testcontent)
  var content = '';

  function functionName(a) {
    var lines = a.split("\n");

    for (var i = 0; i < lines.length; i++) {
      if (lines[i].indexOf('<option value="">합성할 수집품 선택</option>') != -1) {
        console.log(i + '번 째 줄부터');
        var startline = i;
      }
      if (lines[i].indexOf('</select> 을(/를)') != -1) {
        console.log(i + '번 째 줄까지 수집품 목록');
        var endline = i;

      }
    }

    for (var i = startline + 1; i < endline; i++) {
      var test = lines[i].split(">")[1].split("<")[0].trim();


      if (test.indexOf("●") != -1) {
        test = test.split("●")[0].trim()
      }

      if (test.indexOf("★") != -1) {
        test = test.split("★")[0].trim()
      }

      content = content + "\n" + test;

    }
    content = content.replace("[ 00", "\n 사방에 널린 \n[ 00");
    content = content.replace("[ 03", "\n 풍족한 \n[ 03");
    content = content.replace("[ 06", "\n 많은 \n[ 06");
    content = content.replace("[ 09", "\n 흔한 \n[ 09");
    content = content.replace("[ 12", "\n 흔하지 않은 \n[ 12");
    content = content.replace("[ 15", "\n 매우 흔하지 않은 \n[ 15");
    content = content.replace("[ 18", "\n 희귀한 \n[ 18");
    content = content.replace("[ 21", "\n 매우 희귀한 \n[ 21");
    content = content.replace("[ 24", "\n 전설적인 \n[ 24");
    content = content.replace("[ 27", "\n 유일6 \n[ 27");
      console.log(content)
  }
  console.log(content.length)

  await functionName(testcontent);

  res.send(content)

});



module.exports = router;
