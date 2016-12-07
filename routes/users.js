var express = require('express');
var router = express.Router();
var controller=require('../controller/user.server.controller');

var checkLogin = require('../middlewares/check');

router.get('/users',checkLogin.checkLogin,controller.getAllUsers);


router.get('/login',checkLogin.checkLogin,function (req,res) {
   res.send(req.flash());
});

/*用户登录*/
router.post('/login',controller.findByUserName);

module.exports = router;
