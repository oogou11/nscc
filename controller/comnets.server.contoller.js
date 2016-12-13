/**
 * Created by zhangh on 2016/12/13.
 */

var mongoose=require('mongoose');
var News=mongoose.model('News');
var Users=mongoose.model('User');
var Comment=mongoose.model('Comment');
var async=require('async');
var moment=require('moment');
mongoose.Promise = global.Promise;

module.exports= {
    //获取文章的留言
    getCommentByNewsID: function (newsId, callback) {
        Comment.find({news: newsId})
            .populate({path: 'author', model: 'User'})
            .populate({path: 'news', model: 'News'})
            .sort({_id: 1})
            .exec(function (err, doc) {
                if (err) {
                    callback(-1, '系统异常:' + err.message);
                }
                callback(null, doc);
            });
    },
    //添加留言
    createComment: function (req, res, nex) {
        var author = req.session.user._id;
        var news_id = req.params.news_uid;
        var content = req.fields.content;

        var comment = new Comment({
            author: author,
            news: news_id,
            content: content,
            createTime: moment(Date.now()).format('YYYY/MM/DD HH:mm:ss')
        });
        comment.save(function (err) {
            if (err) {
                req.flash('error', '系统异常:' + err.message);
            } else {
                req.flash('success', '留言成功');
            }
            return res.redirect('/news/' + news_id);
        });
    },
    //删除留言
    deleteComment: function (newsId, callback) {
        Comment.remove({news: newsId}, function (err) {
            if (err) {
                callback(-1, '系统异常:' + err.message);
            }
            callback(null);
        });
    },
    //通过文章ID获取留言总数
    getCommentTotalCount: function (newsId, callback) {
        Comment.count({news: newsId}, function (err, result) {
            if (err) {
                callback(-1, '系统异常:' + err.message);
            } else {
                callback(null, result);
            }
        });
    },
    //根据ID删除评论
    deleteCommentById: function (req, res, next) {
        var user_id = req.session.user._id;
        var commentId = req.params.commentId;
        var newsId = req.params.news_uid;

        async.waterfall([
                function (callback) {
                    Comment.findOne({_id: commentId})
                        .populate({path: 'author', model: 'User'})
                        .populate({path: 'news', model: 'News'})
                        .exec(function (err, doc) {
                            if (err) {
                                callback(-1, '系统异常:' + err.message);
                            } else {
                                callback(null, doc);
                            }
                        });
                },
                function (comment, callback) {
                    if (comment.author._id.toString() !== user_id.toString()) {
                        callback(-1, '权限不足!');
                    }
                    if (comment.news._id.toString() !== newsId.toString()) {
                        callback(-1, '权限不足!');
                    }
                    else {
                        Comment.findOneAndRemove(comment._id, function (err, result) {
                            if (err) {
                                callback(-1, '系统异常:' + err.message);
                            } else {
                                callback(null, '操作成功!');
                            }
                        });
                    }
                }
            ],
            function (err, result) {
                if (err) {
                    req.flash('error', result);
                } else {
                    req.flash('success', '操作成功!');
                }
                res.redirect('/news/' + newsId);
            });
    }
}