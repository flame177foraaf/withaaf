var express = require('express');
var asyncify = require('express-asyncify');
var router = asyncify(express.Router());
var app = express();
var bodyParser = require('body-parser');
var url = require('url');


var { Client } = require('pg');

var client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();



router.get('/', async function(req,res, next){
  var psql = "SELECT * FROM aquafeq.freeboard ORDER BY fbid DESC"
  await client.query(psql, async function (err, response){
    await response;
    res.render('board', {
      title: '자유게시판',
      data: response.rows
    });
  });
});

/*
router.get('/board/:page', function(req,res, next){
  var page = req.params.page
  var totalcount ="SELECT count(*) from aquafeq.freeboard;"

  var psql = "SELECT (row_number() OVER(ORDER BY fbid)) AS rownum, fbtitle, fbname, fbcreatedat, count(*) OVER() AS totalcount FROM aquafeq.freeboard ORDER BY fbid DESC limit 10 offset ($1 - 1) * 10";
  client.query(psql, ['%' + page + '%'], function (err, response){
    res.render('boardtest', {
      title: '자유게시판',
      data: response.rows,


    });
  });
});
*/
router.get('/write', async function(req,res,next) {
  res.render('boardwrite' ,{
    title: '글 작성하기'
  });
});

router.get('/:id', async function(req,res,next) {
  console.log(url.parse(req.url, true));

  var fbid = req.params.id;
  if (fbid == undefined) {
      console.log('fbid is null');
      res.redirect('/board');
      return;
    }
  console.log(fbid);
  console.log(typeof(fbid));
  var fbid = parseInt(fbid)
  if (isNaN(fbid)) {
    console.log(fbid);
    res.redirect('/board');
  }

  var QueryString = "SELECT * FROM aquafeq.freeboard WHERE fbid = $1";
  var QueryStringComment = "SELECT * FROM aquafeq.fb_comment WHERE fbid = $1";
  await client.query(QueryString, [fbid], async function (err, response){
    console.log(QueryString);
    if (err) {
      console.log(err);
      res.redirect('/board');
    }

    await client.query(QueryStringComment, [fbid], async function(err, response_comment) {
      console.log(QueryStringComment);
      if (err) {
        console.log(err);
        res.redirect('/board');
      }
      res.render('showboard', {
        data: response.rows[0],
        data_comment: response_comment.rows
      });
    });
  });
});



router.post('/', async function(req,res,next) {
  var BoardBody = req.body.boardbody;
  BoardBody = BoardBody.replace(/(?:\r\n|\r|\n)/g, '<br>');
  var QueryString = "set timezone TO 'Asia/Seoul'";
  var Commentcount = 0;
  await client.query(QueryString, async function (err,response) {
    var QueryString = "INSERT INTO aquafeq.freeboard(fbtitle, fbbody, fbname, fbcreatedat, commentcount) values ($1, $2, $3, to_char(now(), 'YYYY-MM-DD HH24:MI:SS'), $4);";
    await client.query(QueryString, [req.body.title, BoardBody, req.body.writer, Commentcount], async function (err, response){

        var psql = "SELECT * FROM aquafeq.freeboard";
        client.query(psql, function (err, response){
          res.redirect('/board');
        });

    });
  });

});

router.post('/comment', async function(req,res,next) {

  var Comment_body = req.body.comment_box;
  var Comment_writer = req.body.comment_writer;
  var Fbid =req.body.fbid;
  var Count_Comment = req.body.commentcount;
  if (Count_Comment == null) {
    Count_Comment = 0;
  }
  Count_Comment = parseInt(Count_Comment);

  var url ='/board/'+Fbid;
  Comment_body = Comment_body.replace(/(?:\r\n|\r|\n)/g, '<br>');
  var QueryString = "set timezone TO 'Asia/Seoul'";
  await client.query(QueryString, async function(err,response){
    if (err) {
      console.log(err);
    }
    var QueryString = "INSERT INTO aquafeq.fb_comment(fbid, writer, body, time) values ($1, $2, $3, to_char(now(), 'YYYY-MM-DD HH24:MI'));";
    await client.query(QueryString, [Fbid, Comment_writer, Comment_body], async function (err, response){
      if (err) {
        console.log(err);
      }
      Count_Comment = Count_Comment+1;
      var QueryString = "UPDATE aquafeq.freeboard SET commentcount = $1 where fbid = $2";
      await client.query(QueryString, [Count_Comment, Fbid], function (err, response){
        res.redirect(url);
      });
    });
  });
});
module.exports = router;
