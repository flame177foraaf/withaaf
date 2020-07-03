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
    res.render('test', {
      title: '자유게시판',
      data: response.rows
    });
  });
});

/*
router.get('/test/:page', (req,res, next) => {
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
  res.render('testboardwrite' ,{
    title: '글 작성하기'
  });
});

router.get('/:id', (req, res, next) => {
  var fbid = req.params.id;
  client.query("SELECT fbid, fbtitle, fbbody, fbname, fbcreatedat FROM aquafeq.freeboard WHERE fbid=$1", [fbid], (err, response) => {
    client.query("SELECT * FROM aquafeq.fb_comment WHERE fbid=$1", [fbid], (err, response_comment) => {

      res.render('testshowboard', {
        data: response.rows[0],
        data_comment: response_comment.rows
      });
    });  
  });
});



router.post('/', (req, res, next) => {
  var BoardBody = req.body.boardbody;
  BoardBody = BoardBody.replace(/(?:\r\n|\r|\n)/g, '<br />');
  var QueryString = "set timezone TO 'Asia/Seoul'";
  client.query(QueryString, (err,response) => {
    var QueryString = "INSERT INTO aquafeq.freeboard(fbtitle, fbbody, fbname, fbcreatedat) values ($1, $2, $3, to_char(now(), 'YYYY-MM-DD HH24:MI'));"
    client.query(QueryString, [req.body.title, BoardBody, req.body.writer], (err, response) => {
      if (err) {
        console.error();
      } else {
        var psql = "SELECT * FROM aquafeq.freeboard"
        client.query(psql, (err, response) => {
          res.redirect('/test')
        });
      };
    });
  })

});

router.post('/comment', (req, res, next) => {
  var Comment_body = req.body.comment_box;
  var Comment_writer = req.body.comment_writer
  var Fbid = req.body.fbid;

  Comment_body = Comment_body.replace(/(?:\r\n|\r|\n)/g, '<br />');
  var QueryString = "set timezone TO 'Asia/Seoul'";
  client.query(QueryString, (err,response) => {
    var QueryString = "INSERT INTO aquafeq.fb_comment(fbid, writer, body, time) values ($1, $2, $3, to_char(now(), 'YYYY-MM-DD HH24:MI'));"
    client.query(QueryString, [Fbid, Comment_writer, Comment_body], (err, response) => {
      res.send(response)
    });
  })
});

module.exports = router;
