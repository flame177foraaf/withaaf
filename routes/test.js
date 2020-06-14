
var request = require('request'),
    cheerio = require('cheerio');

var url = "http://aquaf.ssz.kr:8888/main/myrecipe.php";


request(url, function (err, res, html) {
    if (!err) {
        var $ = cheerio.load(html);
        console.log($)

        // 블로그 title 정보 가져오기
        $(".aaf table_st").each(function () {
          console.log($.this)
        });
    }
})
