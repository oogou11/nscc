var express = require('express');
var router = express.Router();
var controller=require('../controller/user.server.controller');
var checkLogin = require('../middlewares/check');

router.get('/login',checkLogin.checkNotLogin,function (req,res) {
    res.render('login');
});

router.post('/login',checkLogin.checkNotLogin,controller.findByUserName);

router.get('/logout',checkLogin.checkLogin,function (req,res) {
    // 清空 session 中用户信息
    req.session.user = null;
    req.flash('success', '登出成功');
    // 登出成功后跳转到主页
    res.redirect('/users/login');
});

router.get('/register', checkLogin.checkNotLogin,function(req, res,next) {
    res.render('register');
});

router.post('/register',checkLogin.checkNotLogin,controller.create );

module.exports = router;
