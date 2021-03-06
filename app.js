var http = require("http");
setInterval(function () {
  http.get("http://withaaf.herokuapp.com")

} , 150000);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var sslRedirect = require('heroku-ssl-redirect');
//
var bodyParser = require('body-parser');
var morgan = require('morgan') //로그 모듈 임포트
//

var indexRouter = require('./routes/index');

var usersRouter = require('./routes/users');
var aafwpRouter = require('./routes/aafwp');
//var aafwpaddRouter = require('./routes/wpAdd');
var aafarmRouter = require('./routes/aafarm');
//var aafarmaddRouter = require('./routes/armAdd');
var aafaccRouter = require('./routes/aafacc');
//var aafaccaddRouter = require('./routes/accadd');
//var aafmixRouter = require('./routes/mix');
var aaffeatsupRouter = require('./routes/featsup');
//var aaffreedomRouter = require('./routes/index');
//var aafQARouter = require('./routes/index');
var aafgemRouter = require('./routes/aafgem');
var aafrecipeRouter = require('./routes/recipe');
var aafboardRouter = require('./routes/board');
//var aafrecipeRouter = require('./routes/recipe2');
var aaftestRouter = require('./routes/test');
var aafmontableRouter =require('./routes/monster');

var assemblewpRouter = require('./routes/Assemblywp');
var assemblearmRouter = require('./routes/Assemblyarm');
var assembleaccRouter = require('./routes/Assemblyacc');

var itemRouter = require('./routes/item');
var rivalRouter = require('./routes/rival');
var searchRouter = require('./routes/search');
var mylistRouter = require('./routes/mylist');





var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(sslRedirect());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(morgan('short')); //로그 미들웨어
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', indexRouter);

app.use('/aafwp', aafwpRouter);

app.use('/aafarm', aafarmRouter);

app.use('/aafacc', aafaccRouter);

app.use('/featsup', aaffeatsupRouter);

app.use('/aafgem', aafgemRouter);

app.use('/recipe', aafrecipeRouter);

app.use('/board', aafboardRouter);

app.use('/test', aaftestRouter);

app.use('/monster', aafmontableRouter);


app.use('/Assemblywp', assemblewpRouter);
app.use('/Assemblyarm', assemblearmRouter);
app.use('/Assemblyacc', assembleaccRouter);
app.use('/item', itemRouter);
app.use('/rival', rivalRouter);
app.use('/search', searchRouter);
app.use('/mylist', mylistRouter);


//app.use('/aafwp/wpadd', aafwpaddRouter);
//app.use('/aafarm/armadd', aafarmaddRouter);
//app.use('/aafacc/accadd', aafaccaddRouter);
//app.use('/mix', aafmixRouter);
//app.use('/qa', aafQARouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
