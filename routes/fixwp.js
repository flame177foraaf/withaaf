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
  var Wpgrade = req.body.wpgrade;
    if (Wpgrade == '') {
      Wpgrade = null
    } else if (Wpgrade !== '') {
      Wpgrade = Wpgrade.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpname = req.body.wpname;
  var Wplimit = req.body.wplimit;
    if (Wplimit == '') {
      Wplimit = null
    }
  var Wpsocket = req.body.wpsocket;
    if (Wpsocket == '') {
      Wpsocket = null
    }
  var Wpether = req.body.wpether;
    if (Wpether == '') {
      Wpether = null
    }
  var Wpstats = req.body.wpstats;
    if (Wpstats == '') {
      Wpstats = null
    } else if (Wpstats !== '') {
      Wpstats = Wpstats.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var Wpproperty = req.body.wpproperty;
    if (Wpproperty == '') {
      Wpproperty = null
    } else if (Wpproperty !== '') {
      Wpproperty = Wpproperty.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpfeat = req.body.wpfeat;
    if (Wpfeat == '') {
      Wpfeat = null
    } else if (Wpfeat !== '') {
      Wpfeat = Wpfeat.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpcustom = req.body.wpcustom;
    if (Wpcustom == '') {
      Wpcustom = null
    } else if (Wpcustom !== ''){
      Wpcustom = Wpcustom.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  var Wpup = req.body.wpup;
    if (Wpup == '') {
      Wpup = null
    } else if (Wpup !== '') {
      Wpup = Wpup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

  var QueryString = "UPDATE aquafeq.aquafwp SET (wpgrade, wplimit, wpsocket, wpether, wpstats, wpproperty, wpfeat, wpcustom, wpup) = ($1, $2, $3, $4, $5, $6, $7, $8, $9)  WHERE wpname = $10 returning *"
  //client.query("UPDATE aquafeq.aquafwp SET wpgrade = Wpgrade, wplimit =Wplimit, wpsocket=Wpsocket, wpether=Wpether, wpstats=Wpstats, wpproperty=Wpproperty, wpfeat=Wpfeat, wpcustom=Wpcustom, wpup=Wpup  WHERE wpname = Wpname ",  (err, response) => {
  client.query(QueryString, [Wpgrade, Wplimit, Wpsocket, Wpether, Wpstats, Wpproperty, Wpfeat, Wpcustom, Wpup, Select_name], (err, response) => {
  console.log(Wpgrade)
  console.log(Wplimit)
  console.log(Wpsocket)
  console.log(Wpether)
  console.log(Wpstats)
  console.log(Wpproperty)
  console.log(Wpfeat)
  console.log(Wpcustom)
  console.log(Wpup)
  console.log(Wpname)
    var QueryString = "select * from aquafeq.aquafwp where wpname = $1"
    client.query ( QueryString, [Wpname],  (err, response) => {
      console.log(response.rows[0])
      res.render('/aafwp', {
        title : Wpname + ' 변경 완료',
        data: response.rows
      })
    });
  });
});

module.exports = router;
