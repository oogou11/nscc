/**
 * Created by zhangh on 2016/11/29.
 */
var mongoose=require('mongoose');
var News=mongoose.model('News');
var Users=mongoose.model('User');
var Comment=mongoose.model('Comment');
var async=require('async');
var moment=require('moment');
var commentController=require('./comnets.server.contoller');
mongoose.Promise = global.Promise;

module.exports= {
    /*新增文章*/
    create_news: function (req, res, next) {
        var uid = req.session.user.uid;
        var title = req.fields.title;
        var content = req.fields.content;
        async.waterfall([
            function (callback) {
                if (!title.length) {
                    callback(-1, '请填写标题');
                }
                if (!content.length) {
                    callback(-1, '请填写内容');
                }else
                callback(null, '');
            },
            function (user, callback) {
                Users.findOne({uid: uid}, function (err, user) {
                    if (err) {
                        callback(-1, uid + "不存在");
                    }
                    if (!user) {
                        callback(-1, '用户不存在');
                    }else
                    callback(null, user);
                });
            },
            function (user, callback) {
                var news = new News({
                    title: title,
                    content: content,
                    author: user,
                    pv: 0,
                    createTime:moment(Date.now()).format('YYYY/MM/DD HH:mm:ss')
                });
                news.save(function (err) {
                    if (err) {
                        callback(-1, '服务端异常,请联系管理员:'+err.message);
                    }else
                    callback(null, news._id);
                });
            }
        ], function (err, result) {
            if (err) {
                req.flash('error', result);
                res.redirect('/news/create');
            } else {
                req.flash('success', '操作成功');
                res.redirect('/news/' + result);
            }
        });
    },
    //浏览文章记录+1
    findNewsAndPvAdd: function (req, res, next) {
        var news_id = req.params.news_uid;
        async.parallel([
            //更新浏览数量
            function (callback) {
                News.update({_id: news_id}, {$inc: {pv: 1}}, function (err) {
                    if (err) {
                        callback(-1, '更新访问数量异常：' + err.message);
                    }else{
                        callback(null,'');
                    }
                });
            },
            //查找news
            function (callback) {
                var query = News.findOne({_id: news_id});
                query.populate({path: 'author', model: 'User'})
                    .exec(function (err, doc) {
                        if (err) {
                            callback(-1, '查询News异常：' + err.message);
                        }
                        if (!doc) {
                            callback(-1, '未找到数据');
                        }else {
                            callback(null, doc);
                        }
                    });
            },
            //统计留言总量
            function (callback) {
                commentController.getCommentTotalCount(news_id,function (err,doc) {
                   if(err){
                       callback(-1,'数据异常:'+err.message);
                   }else{
                       callback(null,doc);
                   }
                });
            },
            //评论
            function (callback) {
                commentController.getCommentByNewsID(news_id,function (err,doc) {
                    if(err){
                        callback(-1,'数据异常:'+err.message);
                    }else{
                        callback(null,doc);
                    }
                });
            }
        ], function (err, result) {
            var message;
            if (err) {
                if (result.length > 1) {
                    message = result[1];
                } else {
                    message = result[2];
                }
                req.flash('error', message);
                return res.redirect('/news/create');
            } else {
                var news = result[1];
                var comments=result[3];
                news.commentsCount=result[2];
                return res.render('news/index', {
                    news: news,
                    comments: comments
                });
            }
        });
    },
    //通过Id查找news
    findNewsById: function (req, res, next) {
        var author = req.session.user._id;
        var news_id = req.params.news_uid;
        async.waterfall([
            //获取文章
            function (callback) {
                News.findOne({_id: news_id})
                    .populate({path: 'author', model: 'User'})
                    .exec(function (err, doc) {
                        if (err) {
                            callback(-1, '查询异常:' + err.message);
                        }
                        if (!doc) {
                            callback(-1, '文章不存在');
                        }
                        callback(null, doc);
                    });
            },
            //判断当前用户是否是作者
            function (news, callback) {
                if (news.author._id.toString() !== author.toString()) {
                    callback(-1, '无权限操作');
                } else {
                    callback(null, news);
                }
            }
        ], function (err, result) {
            if (err) {
                req.flash('error', result);
                return res.redirect('/index');
            } else {
                result.CreateDate = moment(result.CreateDate).format('L');
                res.render('news/edit', {
                    news: result
                });
            }
        });
    },
    //更新文章
    updateNewsById: function (req, res, next) {
        var news_uid = req.params.news_uid;
        var author = req.session.user._id;
        var title = req.fields.title;
        var content = req.fields.content;
        News.findByIdAndUpdate(
            news_uid,
            {$set: {title: title, content: content}},
            {new: true},
            function (err, doc) {
                if (err) {
                    req.flash('error', '更新失败:' + err.message);
                    return res.redirect('/news/'+news_uid+'/edit');
                }
                if (!doc) {
                    req.flash('error', '更新后未找到文章');
                }
                else {
                    req.flash('success', '操作成功');
                }
                return res.redirect('/news/'+news_uid);
            });
    },
    //删除文章
    deleteNewsById:function (req,res,next) {
        var author = req.session.user._id;
        var news_id = req.params.news_uid;

        async.waterfall([
            function (callback) {
                News.findOne({_id: news_id})
                    .populate({path: 'author', model: 'User'})
                    .exec(function (err, doc) {
                        if (err) {
                            callback(-1, '查询异常:' + err.message);
                        }
                        if (!doc) {
                            callback(-1, '文章不存在');
                        }else
                        callback(null, doc);
                    });
            },
            //判断当前用户是否是作者
            function (news, callback) {
                if (news.author._id.toString() !== author.toString()) {
                    callback(-1, '无权限操作');
                } else {
                    News.findByIdAndRemove(news._id,function (err,result) {
                        if(err){
                            callback(-1,'操作失败:'+err.message);
                        }else{
                            callback(null,'');
                        }
                    });
                }
            },
            //删除文章下的所有留言
            function (empty,callback) {
                commentController.deleteComment(news_id,function (err) {
                    if(err){
                        callback(-1,'失败:'+err.message);
                    }else
                    callback(null,'');
                });
            }
        ], function (err, result) {
            if(err){
                req.flash('error',result);
                return res.redirect('/news/'+news_id);
            }else {
                req.flash('success','操作成功');
                return res.redirect('/index');
            }
        });

    }
}