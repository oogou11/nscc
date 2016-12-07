/**
 * Created by zhangh on 2016/12/6.
 */
var express = require('express');
var router = express.Router();
var controller=require('../controller/user.server.controller');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin,function(req, res,next) {
    res.render('register');
});

router.post('/',checkNotLogin,controller.create );

module.exports = router;