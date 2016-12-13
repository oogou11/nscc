/**
 * Created by zhangh on 2016/11/29.
 */
var mongoose=require('mongoose');
var News=mongoose.model('News');
var Users=mongoose.model('User');
var async=require('async');
var moment=require('moment');

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
                }
                callback(null, '');
            },
            function (user, callback) {
                Users.findOne({uid: uid}, function (err, user) {
                    if (err) {
                        callback(-1, uid + "不存在");
                    }
                    if (!user) {
                        callback(-1, '用户不存在');
                    }
                    callback(null, user);
                });
            },
            function (user, callback) {
                var news = new News({
                    title: title,
                    content: content,
                    author: user,
                    pv: 0
                });
                news.save(function (err) {
                    if (err) {
                        callback(-1, '服务端异常,请联系管理员');
                    }
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
            function (callback) {
                News.update({_id: news_id}, {$inc: {pv: 1}}, function (err) {
                    if (err) {
                        callback(-1, '更新访问数量异常：' + err.message);
                    }
                    callback(null,'更新成功');
                });
            },
            function (callback) {
                var query = News.findOne({_id: news_id});
                mongoose.Promise = global.Promise;
                query.populate({path: 'author', model: 'User'})
                    .exec(function (err, doc) {
                        if (err) {
                            callback(-1, '查询News异常：' + err.message);
                        }
                        if (!doc) {
                            callback(-1, '未找到数据');
                        }
                        callback(null, doc);
                    });
            }
        ], function (err, result) {
            var message;
            if(err){
                if(result.length>1){
                    message=result[1];
                }else{
                    message=result[2];
                }
                req.flash('error', message);
                return res.redirect('/news/create');
            }
            var news=result[1];
            news.CreateDate=moment(news.CreateDate).format('L');
            res.render('news/index',{
                news:news
            });
        });
    }
}