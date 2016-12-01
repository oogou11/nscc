/**
 * Created by zhangh on 2016/11/29.
 */
var express = require('express');
var router = express.Router();
var controller=require('../controller/news.server.controller');

router.get('/',function (req,res) {
    res.render('news',{title:'news'});
});
router.post('/',controller.create);

module.exports = router;