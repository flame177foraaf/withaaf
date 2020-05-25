var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var $ = require('jquery');

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();

router.get('/', (req,res,next) => {
  var Assembly = req.query.assembly;

  var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = $1";
  client.query(QueryString, [Assembly],(err, response) => {
    res.render('Assemblywp', {
      title: '무기 재조립하기',
      data: response.rows[0]
    });
  });
});

router.get('/ing', (req,res,next) => {
  var Assembly = req.query.assembly;
  //console.log(Assembly)
  var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = $1";
  client.query(QueryString, [Assembly], (err, response) => {
    if (typeof(response.rows[0]) === 'undefined') {
      var data = {
        Assembly:"null",
        wpgrade: "null",
        wpname: "null",
        wplimit: "null",
        wpsocket : "null",
        wpether: "null",
        wpstats: "null",
        wpproperty: "null",
        wpfeat: "null",
        wpcustom: "null",
        result_socket: "null",
        result_custom: "null",
        result_stats:"null",
    };
    } else {
      //console.log(response.rows[0].wpcustom);
      //console.log(response.rows[0])
      var Allcustom = response.rows[0].wpcustom;
      //console.log(Allcustom);
      var eqcustom = Allcustom.split('<br />');
      var result_custom = 'null';

      function Dice_roll(min, max){   //주사위 굴리기
        var diceroll = max - min + 1;
        return Math.floor(Math.random() * diceroll + min);
      }

      // 커스텀 재조립
      for (var i = 0; i < eqcustom.length; i++) {
        if (eqcustom[i].indexOf("웨이블렘") == -1) {
          var find_cus_val1 = eqcustom[i].indexOf("(");
          var find_cus_val2 = eqcustom[i].indexOf(")");
          var find_cus_per1 = eqcustom[i].indexOf("[");
          var find_cus_per2 = eqcustom[i].indexOf("]");
          var cut_cus_name = eqcustom[i].substring(0,find_cus_val1);
          var cut_cus_value = eqcustom[i].substring(find_cus_val1+1,find_cus_val2); //커스텀 수치
          //var random_num = Math.floor(Math.random() * 10 + 1);
          var leng = eqcustom[i].length;
          var cus_per = eqcustom[i].substring(find_cus_per1+1,find_cus_per2); // 대괄호
          var cus_per_0 = cus_per.indexOf("%");
          var cus_per_1 = cus_per.substring(0,cus_per_0);  // 커스텀 뜰 확률
          var cus_per_2 = Math.floor(Math.random() * 100) + 1
          if (cus_per_2 <= cus_per_1) {
            var cut_in_custom = cut_cus_value.indexOf("~");
            var find_per_custom = cut_cus_value.indexOf("%");
            var find_minus_custom = cut_cus_value.indexOf("-");
            var custommin = cut_cus_value.substring(0,cut_in_custom); //커스텀 수치 최소  3 %
            var custommax = cut_cus_value.substring(cut_in_custom+1); //커스텀 수치 최대    20 %
            if (find_per_custom !== -1) {
              var find_per_cusmin = custommin.indexOf("%");
              var find_per_cusmax = custommax.indexOf("%");
              var custommin = custommin.substring(0,find_per_cusmin);
              var custommax = custommax.substring(0, find_per_cusmax);

              var rancustom = Dice_roll(parseInt(custommin), parseInt(custommax));
              if (rancustom !== 0) {
                var rancustom = rancustom + ' %';
              }
            } else {

              var rancustom = Dice_roll(parseInt(custommin), parseInt(custommax));
            }
            if (rancustom !== 0) {
              if (find_minus_custom !== -1) {
                if (result_custom === 'null') {
                  var result_custom = cut_cus_name + rancustom;
                } else {
                  var result_custom = result_custom +"<br />" + cut_cus_name + rancustom;
                }
              } else {
                if (result_custom === 'null') {
                  var result_custom = cut_cus_name +"+ "+ rancustom;
                } else {
                  var result_custom = result_custom +"<br />" + cut_cus_name +"+ "+ rancustom;
                }
              }
            }
          }
        } else {
          var find_cus_val1 = eqcustom[i].indexOf("("); //웨이블렘 괄호
          var find_cus_val2 = eqcustom[i].indexOf(")"); //웨이블렘 괄호
          var find_cus_val1 = eqcustom[i].indexOf("(",find_cus_val1 +1);
          var find_cus_val2 = eqcustom[i].indexOf(")",find_cus_val2 +1);
          var find_cus_per1 = eqcustom[i].indexOf("[");
          var find_cus_per2 = eqcustom[i].indexOf("]");
          var cut_cus_name = eqcustom[i].substring(0,find_cus_val1);
          var cut_cus_value = eqcustom[i].substring(find_cus_val1+1,find_cus_val2); //커스텀 수치


          //var random_num = Math.floor(Math.random() * 10 + 1);
          var leng = eqcustom[i].length;


          var cus_per = eqcustom[i].substring(find_cus_per1+1,find_cus_per2); // 대괄호
          var cus_per_0 = cus_per.indexOf("%");
          var cus_per_1 = cus_per.substring(0,cus_per_0);  // 커스텀 뜰 확률
          var cus_per_2 = Math.floor(Math.random() * 100) + 1

          if (cus_per_2 <= cus_per_1) {
            var cut_in_custom = cut_cus_value.indexOf("~");
            var find_per_custom = cut_cus_value.indexOf("%");
            var find_minus_custom = cut_cus_value.indexOf("-");
            var custommin = cut_cus_value.substring(0,cut_in_custom); //커스텀 수치 최소  3 %
            var custommax = cut_cus_value.substring(cut_in_custom+1); //커스텀 수치 최대    20 %
            if (find_per_custom !== -1) {
              var find_per_cusmin = custommin.indexOf("%");
              var find_per_cusmax = custommax.indexOf("%");
              var custommin = custommin.substring(0,find_per_cusmin);
              var custommax = custommax.substring(0, find_per_cusmax);

              var rancustom = Dice_roll(parseInt(custommin), parseInt(custommax));

              if (rancustom !== 0) {
                var rancustom = rancustom + ' %';
              }
            } else {

              var rancustom = Dice_roll(parseInt(custommin), parseInt(custommax));
            }
            if (rancustom !== 0) {
              if (find_minus_custom !== -1) {
                if (result_custom === 'null') {
                  var result_custom = cut_cus_name + rancustom;
                } else {
                  var result_custom = result_custom +"<br />" + cut_cus_name + rancustom;
                }
              } else {
                if (result_custom === 'null') {
                  var result_custom = cut_cus_name +"+ "+ rancustom;
                } else {
                  var result_custom = result_custom +"<br />" + cut_cus_name +"+ "+ rancustom;
                }
              }
            }

          }
        }
      }

      //소켓 재조
      var Allsocket = response.rows[0].wpsocket
      //console.log("소켓" + testsocket.length)
      //console.log("소켓 구분" + testsocket.indexOf("~"))
      if (Allsocket.indexOf("~") == -1) {
        var socket = "";

        for (var i = 0; i < Allsocket; i++) {
          socket = socket + "○"
        }
        var result_socket = socket ;

      } else {
        var minsocket = Allsocket.substring(0,Allsocket.indexOf("~"));
        var maxsocket = Allsocket.substring(Allsocket.indexOf("~")+1,Allsocket.length)
        var socket = "";
        var socketx = "";
        var socket_roll = Dice_roll(parseInt(minsocket),parseInt(maxsocket)) //소켓 범위 내에서 굴리기

        for (var i = 0; i < socket_roll; i++) {
          socket = socket + "○"
        }
        for (var j = parseInt(maxsocket)-socket_roll ; j > 0; j--) {
          socketx = socketx + "●"
        }
        var result_socket = socket + socketx;
        //console.log("소켓 주사위 굴리기" +socket_roll)
        //console.log(socket + socketx)
      }


      // 스텟 재조립
      var ALlstats = response.rows[0].wpstats
      // console.log(ALlstats.indexOf("/"))
      var cut1_stats = ALlstats.substring(0,ALlstats.indexOf("/"))
      var cut2_stats = ALlstats.substring(ALlstats.indexOf("/")+1)
      //console.log(cut1_stats)
      //console.log(cut2_stats)
      var first_stat = cut1_stats.substring(cut1_stats.indexOf("+") +1)
      var second_stat = cut2_stats.substring(cut2_stats.indexOf("+") +1)
      //console.log(first_stat)
      //console.log(second_stat)
      //console.log(parseInt(first_stat))

      var Dice_roll_first_stat = parseInt(Dice_roll(-10,10))
      //console.log(Dice_roll_first_stat)
      var Dice_roll_first_stat_per =  (100 + Dice_roll_first_stat  )/100
      //console.log(Dice_roll_first_stat_per)
      var first_stat = parseInt(first_stat)*Dice_roll_first_stat_per
      var first_stat = Math.floor(first_stat)  //소수점 버리기
      if (Dice_roll_first_stat > 0) {
        var result_first_stats = first_stat + "(" +" + "+ Dice_roll_first_stat + " % " + ")";
      }else {
        var result_first_stats =first_stat + " ( " + Dice_roll_first_stat + " % " + ") ";

      }

      var Dice_roll_second_stat = parseInt(Dice_roll(-10,10))
      //console.log(Dice_roll_second_stat)
      var Dice_roll_second_stat_per =  (100 + Dice_roll_second_stat  )/100
      //console.log(Dice_roll_second_stat_per)
      var second_stat = parseInt(second_stat)*Dice_roll_second_stat_per
      var second_stat = Math.floor(second_stat) //소수점 버리기
      if (Dice_roll_second_stat > 0) {
        var result_second_stats = second_stat + "(" +" + "+ Dice_roll_second_stat + " % " + ")";
      } else {
        var result_second_stats =second_stat + " ( " + Dice_roll_second_stat + " % " + ") ";
      }
      var result_stats = result_first_stats +" / " +result_second_stats;

      var data =
        {
          Assembly:Assembly,
          wpgrade: response.rows[0].wpgrade,
          wpname: response.rows[0].wpname,
          wplimit: response.rows[0].wplimit,
          wpsocket : response.rows[0].wpsocket,
          wpether: response.rows[0].wpether,
          wpstats: response.rows[0].wpstats,
          wpproperty: response.rows[0].wpproperty,
          wpfeat: response.rows[0].wpfeat,
          wpcustom: response.rows[0].wpcustom,
          result_socket: result_socket,
          result_custom: result_custom,
          result_stats:result_stats,
        };
    }

    console.log("재조립중   " + data.Assembly);
    res.send(data)
  });
})

module.exports = router;
