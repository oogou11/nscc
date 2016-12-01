var express = require('express');
var router = express.Router();
var controller=require('../controller/user.server.controller');

router.get('/users',controller.getAllUsers);


router.get('/login',function (req,res) {
   res.render('login',{title:'登录'});
});

/*用户登录*/
router.post('/login',controller.findByUserName);

router.get('/register',function (req,res,next) {
   res.render('register',{title:'注册'})
});

router.post('/register',controller.create);

module.exports = router;
