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
        var userName=req.fields.userName;
        var gender=req.fields.gender;
        var bio = req.fields.bio;
        var password = req.fields.password;
        var rePassword = req.fields.repassword;

        async.parallel([
            /*验证*/
            function (callback) {
                if (!(userName.length >= 1 && userName.length <= 10)) {
                    callback(-1,'名字请限制在 1-10 个字符');
                }
                if (['1', '2', '3'].indexOf(gender) === -1) {
                    callback(-1,'性别只能是 1、2 或 3');
                }
                if (!(bio.length >= 1 && bio.length <= 30)) {
                    callback(-1,'个人简介请限制在 1-30 个字符');
                }
                if (!req.files.avatar.name) {
                    callback(-1,'缺少头像');
                }
                if (password.length < 6) {
                    callback(-1,'密码至少 6 个字符');
                }
                if (password !== rePassword) {
                    callback(-1,'两次输入密码不一致');
                }
                var users=new User({
                    userName:userName,
                    password:password,
                    gender:gender,
                    bio:bio
                });
                callback(null,users);
            },
            /*查找用户*/
            function(users,callback) {
                users.findOne({userName:users.userName},function (err,doc) {
                    if(err){
                        callback();
                    }
                    if(doc)
                    {
                        callback(contextError.userExists,'用户已存在')
                    }
                    callback(null,users);
                });
            },function (users,callback) {
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
                req.flash('error',result[0]);
                res.redirect('/register');
            }
            req.flash('success', '注册成功');
            res.redirect('/index');
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
            delete result.password;
            req.session.user=result;
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
    },

}


