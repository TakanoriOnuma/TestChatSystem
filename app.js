var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var MONGO_URL = process.env.MONGOLAB_URI || 'mongodb://localhost/chat';

var mongoose = require('mongoose');
var res = mongoose.connect(MONGO_URL);

var routes = require('./routes/index');
var users = require('./routes/users');

//var port = process.env.PORT || 3000;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// スキーマの定義
var Schema = mongoose.Schema;
var chatSchema = new Schema({
  createdDate : { type: Date, default: Date.now },
  name : String,
  text : String,
  isMove : { type: Boolean, default: false },
  x : { type: Number, default: 400 },
  y : { type: Number, default: 50 }
});
mongoose.model('Chat', chatSchema);

// /chatにGETアクセスした時、chat一覧を取得するAPI
app.get('/chat', function(req, res) {
  var Chat = mongoose.model('Chat');
  // 全てのチャットを取得して送る
  Chat.find({}, function(err, chats) {
    res.send(chats);
  });
});

// /chatにPOSTアクセスしたとき、Chatを追加するAPI
app.post('/chat', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;
  if(name && text) {
    var Chat = mongoose.model('Chat');
    var chat = new Chat();
    chat.name = name;
    chat.text = text;
    chat.save();

    res.send(true);
  }
  else {
    res.send(false);
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;