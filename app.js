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
app.use('/', indexRouter);

var usersRouter = require('./routes/users');
var aafwpRouter = require('./routes/aafwp');
app.use('/aafwp', aafwpRouter);
//var aafwpaddRouter = require('./routes/wpAdd');
var aafarmRouter = require('./routes/aafarm');
app.use('/aafarm', aafarmRouter);
//var aafarmaddRouter = require('./routes/armAdd');
var aafaccRouter = require('./routes/aafacc');
app.use('/aafacc', aafaccRouter);
//var aafaccaddRouter = require('./routes/accadd');
//var aafmixRouter = require('./routes/mix');
var aaffeatsupRouter = require('./routes/featsup');
app.use('/featsup', aaffeatsupRouter);
//var aaffreedomRouter = require('./routes/index');
//var aafQARouter = require('./routes/index');
var aafgemRouter = require('./routes/aafgem');
app.use('/aafgem', aafgemRouter);
var aafrecipeRouter = require('./routes/recipe');
app.use('/recipe', aafrecipeRouter);
var aafboardRouter = require('./routes/board');
app.use('/board', aafboardRouter);
//var aafrecipeRouter = require('./routes/recipe2');
var aaftestRouter = require('./routes/test');
app.use('/test', aaftestRouter);
var aafmontableRouter =require('./routes/monster');
app.use('/monster', aafmontableRouter);
var fixwpRouter = require('./routes/fixwp');
app.use('/fixwp', fixwpRouter);

var assembleRouter = require('/routes/testAssembly');
app.use('/testAssembly', assembleRouter);

//app.use('/aafwp/wpadd', aafwpaddRouter);
//app.use('/aafarm/armadd', aafarmaddRouter);
//app.use('/aafacc/accadd', aafaccaddRouter);
//app.use('/mix', aafmixRouter);
//app.use('/qa', aafQARouter);




var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(morgan('short')) //로그 미들웨어
app.use(bodyParser.urlencoded({extended:true}))




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
