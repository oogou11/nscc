var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session=require('express-session');
var config = require('config-lite');


/*mongoose读取数据库*/
var mongoose=require('./config/mongoose');
var db=mongoose();
var mongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');

var users = require('./routes/users');
var index=require('./routes/index');
var news=require('./routes/news');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-mate'));

// 设置模板全局常量
app.locals.blog = {
  title:'node system blog',
  description: 'design by Justin'
};

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// flash 中间价，用来显示通知
app.use(flash());

app.use(session({
  name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}));

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user=req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/images'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));


app.use('/users', users);
app.use('/index',index);
app.use('/news',news);

app.use(function (req, res) {
  if (!res.headersSent) {
    res.render('404');
  }
});
app.use(function (err, req, res, next) {
  res.render('error', {
    error: err
  });
});
module.exports = app;
