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
  var QueryString = "select wpname from aquafeq.aquafwp"
  client.query(QueryString, (err, response) => {
    var Select_name = req.query.Seachname;
    var QueryString = "select * from aquafeq.aquafwp where wpname = $1"
    client.query(QueryString, [Select_name], (err, response) => {
      if(typeof(response.rows[0]) !== "object") {
        res.render ('wpadd', {
          title: '신규 장비  ->  ' + Select_name + '  <- 등록',
        })
      } else {
        res.render ('fixwp', {
          title:Select_name + '정보',
          data:response.rows[0]
        });
      }
    })
  })
})

router.post('/', (req,res,next) => {
  var Select_name = req.query.Seachname;
  var Wpgrade = req.body.wpgrade;
    if (Wpgrade !== '') {
      Wpgrade = Wpgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wplimit = req.body.wplimit;
    if (Wplimit == '') {
      Wplimit = null
    }
  var Wpsocket = req.body.wpsocket;
  var Wpether = req.body.wpether;
  var Wpstats = req.body.wpstats;
    if (Wpstats !== '') {
      Wpstats = Wpstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpproperty = req.body.wpproperty;
    if (Wpproperty !== '') {
      Wpproperty = Wpproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpfeat = req.body.wpfeat;
    if (Wpfeat !== '') {
      Wpfeat = Wpfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpcustom = req.body.wpcustom;
    if (Wpcustom !== ''){
      Wpcustom = Wpcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpup = req.body.wpup;
    if (Wpup !== '') {
      Wpup = Wpup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  //var QueryString = "UPDATE aquafeq.aquafwp SET (wpgrade, wplimit, wpsocket, wpether, wpstats, wpproperty, wpfeat, wpcustom, wpup) = ($1, $2, $3, $4, $5, $6, $7, $8, $9)  WHERE wpname = $10"
  var QueryString = "UPDATE aquafeq.aquafwp SET wpgrade = $1, wplimit = $2, wpsocket = $3, wpether = $4, wpstats = $5, wpproperty = $6, wpfeat = $7, wpcustom = $8, wpup = $9  WHERE wpname = $10"
  client.query(QueryString, [Wpgrade, Wplimit, Wpsocket, Wpether, Wpstats, Wpproperty, Wpfeat, Wpcustom, Wpup, Select_name], (err, response) => {
    console.log(Select_name)
    var QueryString = "select * from aquafeq.aquafwp WHERE wpname like $1"
    client.query (QueryString, ['%' + Select_name + '%'], (err,response) => {
      console.log(Select_name)
      console.log(response.rows)

      res.render('aafwp', {
        title:Select_name + '  변경 완료',
        data:response.rows
      });
    } )
    console.log(Wpgrade)

  });

});


module.exports = router;
