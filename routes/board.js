var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var url = require('url');


const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
});

client.connect();



router.get('/', (req,res, next) => {

  var psql = "SELECT * FROM aquafeq.freeboard ORDER BY fbid DESC"
  client.query(psql, (err, response) => {
    res.render('board', {
      title: '자유게시판',
      data: response.rows
    });
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
  console.log(req.url)
  var QueryString = "SELECT * FROM aquafeq.freeboard WHERE fbid=$1"
  var QueryStringComment = "SELECT * FROM aquafeq.fb_comment WHERE fbid=$1"
  client.query(QueryString, [fbid], (err, response) => {
    console.log(QueryString)
    if (err) {
      console.log(err)
      res.redirect('/board')
    }

    client.query(QueryStringComment, [fbid], (err, response_comment) => {
      console.log(QueryStringComment)
      if (err) {
        console.log(err)
        res.redirect('/board')
      }
      res.render('showboard', {
        data: response.rows[0],
        data_comment: response_comment.rows
      });
    });
  });
});



router.post('/', (req, res, next) => {
  console.log(req.url)

  var BoardBody = req.body.boardbody;
  BoardBody = BoardBody.replace(/(?:\r\n|\r|\n)/g, '<br />');
  var QueryString = "set timezone TO 'Asia/Seoul'";
  var Commentcount = 0;
  client.query(QueryString, (err,response) => {
    var QueryString = "INSERT INTO aquafeq.freeboard(fbtitle, fbbody, fbname, fbcreatedat, commentcount) values ($1, $2, $3, to_char(now(), 'YYYY-MM-DD HH24:MI:SS'), $4);"
    client.query(QueryString, [req.body.title, BoardBody, req.body.writer, Commentcount], (err, response) => {
      if (err) {
        console.log(err);
      } else {
        var psql = "SELECT * FROM aquafeq.freeboard"
        client.query(psql, (err, response) => {
          res.redirect('/board')
        });
      };
    });
  })

});

router.post('/comment', (req, res, next) => {
  console.log(req.url)
  var Comment_body = req.body.comment_box;
  var Comment_writer = req.body.comment_writer;
  var Fbid =req.body.fbid;
  var Count_Comment = req.body.commentcount;
  if (Count_Comment == null) {
    Count_Comment = 0;
  }
  Count_Comment = parseInt(Count_Comment)

  var url ='/board/'+Fbid


  Comment_body = Comment_body.replace(/(?:\r\n|\r|\n)/g, '<br />');
  var QueryString = "set timezone TO 'Asia/Seoul'";
  client.query(QueryString, (err,response) => {
    if (err) {
      console.log(err);
    }
    var QueryString = "INSERT INTO aquafeq.fb_comment(fbid, writer, body, time) values ($1, $2, $3, to_char(now(), 'YYYY-MM-DD HH24:MI'));"
    client.query(QueryString, [Fbid, Comment_writer, Comment_body], (err, response) => {
      if (err) {
        console.log(err);
      }
      Count_Comment = Count_Comment+1;
      var QueryString = "UPDATE aquafeq.freeboard SET commentcount = $1 where fbid = $2"
      client.query(QueryString, [Count_Comment, Fbid], (err, response) => {
        res.redirect(url)
      });
    });
  })
});
module.exports = router;
