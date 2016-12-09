/**
 * Created by zhangh on 2016/12/8.
 */
var express = require('express');
var router = express.Router();
var controller=require('../controller/news.server.controller');
var checkLogin = require('../middlewares/check');

/*用户所有文章
*Get news?author=***
* */

/*发表文章 页面*/
router.get('/create',checkLogin.checkLogin,function (req,res) {
    res.render('news/create');
});

/*发表文章*/
router.post('/create',checkLogin.checkLogin,controller.create_news);

/*获取特定文章*/
router.get('/:news_uid',checkLogin.checkLogin,controller.findNewsAndPvAdd);

// GET /posts/:news_uid/edit 更新文章页
router.get('/:news_uid/edit', checkLogin.checkLogin,function (req,res) {
    res.send(req.flash());
});

// POST /posts/:news_uid/edit 更新一篇文章
router.post('/:news_uid/edit', checkLogin.checkLogin,function (req,res) {
    res.send(req.flash());
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:news_uid/remove', checkLogin.checkLogin, function(req, res, next) {
    res.render('');
});
// POST /posts/:postId/comment 创建一条留言
router.post('/:news_uid/comment', checkLogin.checkLogin, function(req, res, next) {
    res.send(req.flash());
});
// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:news_uid/comment/:commentId/remove', checkLogin.checkLogin, function(req, res, next) {
    res.render('');
});

module.exports = router;
