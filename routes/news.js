/**
 * Created by zhangh on 2016/12/8.
 */
var express = require('express');
var router = express.Router();
var controller=require('../controller/news.server.controller');
var commentController=require('../controller/comnets.server.contoller');
var checkLogin = require('../middlewares/check');

/*用户所有文章
*Get news?author=....*/
router.get('/',controller.getAllNewsByAuthor);

/*发表文章 页面*/
router.get('/create',checkLogin.checkLogin,function (req,res) {
    res.render('news/create');
});

/*发表文章*/
router.post('/create',checkLogin.checkLogin,controller.create_news);

/*获取特定文章*/
router.get('/:news_uid',controller.findNewsAndPvAdd);

// GET /posts/:news_uid/edit 更新文章页
router.get('/:news_uid/edit', checkLogin.checkLogin,controller.findNewsById);

// POST /posts/:news_uid/edit 更新一篇文章
router.post('/:news_uid/edit', checkLogin.checkLogin,controller.updateNewsById);

// GET /posts/:postId/remove 删除一篇文章
router.get('/:news_uid/remove', checkLogin.checkLogin,controller.deleteNewsById);

// POST /posts/:postId/comment 创建一条留言
router.post('/:news_uid/comment', checkLogin.checkLogin,commentController.createComment);
// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:news_uid/comment/:commentId/remove', checkLogin.checkLogin,
commentController.deleteCommentById);

module.exports = router;
