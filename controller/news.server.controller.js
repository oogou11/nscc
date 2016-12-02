/**
 * Created by zhangh on 2016/11/29.
 */
var mongoose=require('mongoose');
var News=mongoose.model('News');
var Users=mongoose.model('User');
var async=require('async');
var contextError=require('../config/error.config');

module.exports={
    /*新增文章*/
    create:function (req,res,next) {
        var uid=req.body.uid;
        async.waterfall([
            /*判断用户登录状态*/
            function (callback) {
            },
            /*判断用户是否存在*/
           function (callback) {
               Users.findOne({uid:uid},function (err,users) {
                   if (err) {
                       callback(err);
                   }
                   if (!users) {
                       callback(contextError.userNotExists,'用户不存在');
                   }
                   callback(null,users);
               });
           },function(users,callback){
                var news=new News({
                    title: req.body.title,
                    content: req.body.content,
                    author: users
                });
                news.save(function (err) {
                    if(err){
                        callback(err);
                    }
                });
            }
        ],function(err,result){
            if(err){
                return res.next(err);
            }
            res.json('成功');
        });
    },
    findNewsByUId:function (req,res,next) {
        /*获取session*/
        //必须登录才能继续以下工作
        var uid=req.body.uid;
        if(!uid){
            return json('uid参数不能为空');
        }
    },
    findNewsList:function (req,res,next) {
        
    }
}