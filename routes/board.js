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



router.get('/', (req,res, next) => {
  var psql = "SELECT * FROM aquafeq.freeboard ORDER BY fbid DESC"
  client.query(psql, (err, response) => {
    var psql2 = "SELECT * FROM aquafeq.fb_comment"
    click.query(psql2, (err, responsecommentlength ) => {

      res.render('board', {
        title: '자유게시판',
        data: response.rows
        
      });

    })

  });
});

/*
router.get('/board/:page', (req,res, next) => {
  var page = req.params.page
  var totalcount ="SELECT count(*) from aquafeq.freeboard;"

  var psql = "SELECT (row_number() OVER(ORDER BY fbid)) AS rownum, fbtitle, fbname, fbcreatedat, count(*) OVER() AS totalcount FROM aquafeq.freeboard ORDER BY fbid DESC limit 10 offset ($1 - 1) * 10";
  client.query(psql, ['%' + page + '%'], (err, response) => {
    res.render('boardtest', {
      title: '자유게시판',
      data: response.rows,


    });
  });
});
*/
router.get('/write', (req, res, next) => {
  res.render('boardwrite' ,{
    title: '글 작성하기'
  });
});

router.get('/:id', (req, res, next) => {
  var fbid = req.params.id;
  client.query("SELECT fbid, fbtitle, fbbody, fbname, fbcreatedat FROM aquafeq.freeboard WHERE fbid=$1", [fbid], (err, response) => {
    console.log( )
    res.render('showboard', {
      data: response.rows[0]
    });
  });
});



router.post('/', (req, res, next) => {
  var BoardBody = req.body.boardbody;
  BoardBody = BoardBody.replace(/(?:\r\n|\r|\n)/g, '<br />');
  var QueryString = "set timezone TO 'Asia/Seoul'";
  client.query(QueryString, (err,response) => {
    var QueryString = "INSERT INTO aquafeq.freeboard(fbtitle, fbbody, fbname, fbcreatedat) values ($1, $2, $3, to_char(now(), 'YYYY-MM-DD HH24:MI:SS'));"
    client.query(QueryString, [req.body.title, BoardBody, req.body.writer], (err, response) => {
      if (err) {
        console.error();
      } else {
        var psql = "SELECT * FROM aquafeq.freeboard"
        client.query(psql, (err, response) => {
          res.redirect('/board')
        });
      };
    });
  })

});

module.exports = router;
