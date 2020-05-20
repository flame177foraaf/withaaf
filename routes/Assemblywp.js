var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();

router.get('/', (req,res,next) => {
  var Assembly = req.query.assembly;
  console.log(req.query.assembly);
  console.log(Assembly);

  var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = $1";
  client.query(QueryString, [Assembly],(err, response) => {
    res.render('Assemblywp', {
      title: '무기 재조립하기',
      data: response.rows[0]
    });
  });
});

router.get('/ing', (req,res,next) => {
  var Assembly = req.query.assembly
  var QueryString = "SELECT * FROM aquafeq.aquafwp where wpname = $1";
  client.query(QueryString, [Assembly], (err, response) => {
    console.log(response.rows[0]);
    console.log(response.rows.wpcustom);
    console.log(response.rows[0].wpcustom);

    var Allcustom = response.rows[0].wpcustom;
    console.log(Allcustom);
    var eqcustom = Allcustom.split('<br />');
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
        var cus_per_2 = Math.floor(Math.random() * (100 - 0 +1)) + 1

        if (cus_per_2 <= parseInt(cus_per_1)) {
          var cut_in_custom = cut_cus_value.indexOf("~");
          var find_per_custom = cut_cus_value.indexOf("%");
          var custommin = cut_cus_value.substring(0,cut_in_custom); //커스텀 수치 최소  3 %
          var custommax = cut_cus_value.substring(cut_in_custom+1); //커스텀 수치 최대    20 %
          if (find_per_custom !== -1) {
            var find_per_cusmin = custommin.indexOf("%");
            var find_per_cusmax = custommax.indexOf("%");
            var custommin = custommin.substring(0,find_per_cusmin);
            var custommax = custommax.substring(0, find_per_cusmax);
            function selectFrom(x, y){
              var choices = y - x + 1;
              return Math.floor(Math.random() * choices + x);
            }
            var rancustom = selectFrom(parseInt(custommax), parseInt(custommin));

            if (rancustom !== 0) {
              var rancustom = rancustom + ' %';
            }
          } else {
            function selectFrom(x, y) {
              var choices = y - x + 1;
              return Math.floor(Math.random() * choices + x);
            }
            var rancustom = selectFrom(parseInt(custommax), parseInt(custommin));
          }
          if (rancustom !== 0) {
            console.log(cut_cus_name + rancustom);
            var result_custom = cut_cus_name + rancustom;
            res.render('Assemblywp', {
              title: '무기 재조립하기',
              data: response.rows[0],
              custom: result_custom
            });
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
        var cus_per_2 = Math.floor(Math.random() * (100 - 0 +1)) + 1

        if (cus_per_2 <= parseInt(cus_per_1)) {
          var cut_in_custom = cut_cus_value.indexOf("~");
          var find_per_custom = cut_cus_value.indexOf("%");
          var custommin = cut_cus_value.substring(0,cut_in_custom); //커스텀 수치 최소  3 %
          var custommax = cut_cus_value.substring(cut_in_custom+1); //커스텀 수치 최대    20 %
          if (find_per_custom !== -1) {
            var find_per_cusmin = custommin.indexOf("%");
            var find_per_cusmax = custommax.indexOf("%");
            var custommin = custommin.substring(0,find_per_cusmin);
            var custommax = custommax.substring(0, find_per_cusmax);
            function selectFrom(x, y){
              var choices = y - x + 1;
              return Math.floor(Math.random() * choices + x);
            }
            var rancustom = selectFrom(parseInt(custommax), parseInt(custommin));

            if (rancustom !== 0) {
              var rancustom = rancustom + ' %';
            }
          } else {
            function selectFrom(x, y) {
              var choices = y - x + 1;
              return Math.floor(Math.random() * choices + x);
            }
            var rancustom = selectFrom(parseInt(custommax), parseInt(custommin));
          }
          if (rancustom !== 0) {
            console.log(cut_cus_name + rancustom);
            var result_custom = cut_cus_name + rancustom;
            res.render('Assemblywp', {
              title: '무기 재조립하기',
              data: response.rows[0],
              custom: result_custom
            });

          }
          console.log(result_custom);

        }
      }
    }
  });
})


module.exports = router;
