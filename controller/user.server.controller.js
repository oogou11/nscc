/**
 * Created by zhangh on 2016/11/29.
 */
var mongoose=require('mongoose');
var User=mongoose.model('User');
var crypto=require('../common/server.common');
var async=require('async');
var contextError=require('../config/error.config');

module.exports={
    /*新增用户*/
    create:function (req,res,next) {
        var users=new User(req.body);
        async.parallel([
            /*查找用户*/
            function(callback) {
                users.findOne({userName:users.userName},function (err,users) {
                    if(err){
                        callback();
                    }
                    if(users)
                    {
                        callback(contextError.userExists,'用户已存在')
                    }
                    callback(null,users);
                });
            },function (callback) {
                //密码加密
                crypto.encryption(users.password,function (err,result) {
                    if(err){
                        callback(err);
                    }
                    users.password=result;
                    users.uid=(new Date()-0).toString();
                    users.save(function (err) {
                        if(err){
                            callback(err);
                        }
                        callback(null,'注册成功');
                    });
                });
            }
        ],function (err,result) {
            if(err){
                return next(err);
            }
            res.json('注册成功');
        });
    },
    /*通过用户名查找用户*/
    findByUserName:function (req,res,next) {
        var userName=req.body.userName;
        var password=req.body.password.toString();
        async.waterfall([
            function (callback) {
                User.findOne({userName:userName},function (err,users) {
                    if(err){
                        callback(err);
                    }
                    callback(null,users);
                });
            },
            function (users,callback) {
                crypto.encryption(password,function (err,result) {
                    if(err){
                        callback(err);
                    }
                    if(!users){
                        callback(contextError.userNotExists,'用户不存在');
                    }
                    if(users.password==result){
                        /*增加cookie*/
                        res.cookie('userName','', {maxAge: 20*60* 1000});
                    }else{
                        callback(contextError.passwordError,'密码错误');
                    }
                    callback(null,'登录成功');
                });
            }
        ],function (err,result) {
            if(err){
                return next(err);
            }
            res.json(result);
        });
    },
    findUserByUid:function (req,res,next) {
        var uid=req.params.uid;
        if(!uid){
            return next(new Error('uid is empty'));
        }
        User.findOne({uid:uid})
            .exec(function (err,doc) {
            if(err){
                return next(err);
            }
            if(!doc){
                return next(new Error('the user is not exists'));
            }
            return res.json(doc);
        });
    },
    /*获取用户信息，分页*/
    getAllUsers:function (req,res,next) {
        var pageSize=parseInt(req.query.pageSize,10)||10;
        var pageStart=parseInt(req.query.pageStart,10)||1;
        User.find()
            .skip((pageStart-1)*pageSize)
            .limit(pageSize)
            .exec(function (err,doc) {
               if(err){
                   return next(err);
               }
               return res.json(doc);
            });
    }
}


