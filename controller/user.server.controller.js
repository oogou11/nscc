/**
 * Created by zhangh on 2016/11/29.
 */
var mongoose=require('mongoose');
var User=mongoose.model('User');
var crypto=require('../common/server.common');
var async=require('async');
var path=require('path');
var sha1 = require('sha1');
var moment=require('moment');

module.exports={
    /*新增用户*/
    create:function (req,res,next) {
        var userName = req.fields.userName;
        var gender = req.fields.gender;
        var bio = req.fields.bio;
        var password = req.fields.password;
        var rePassword = req.fields.repassword;
        var avatar = req.files.avatar.path.split(path.sep).pop();

       /*校验*/
        try {
            if (!(userName.length >= 1 && userName.length <= 10)) {
                throw new Error('名字请限制在 1-10 个字符');
            }
            if (['1', '2', '3'].indexOf(gender) === -1) {
                throw new Error('性别只能是 1、2 或 3');
            }
            if (!(bio.length >= 1 && bio.length <= 30)) {
                throw new Error('个人简介请限制在 1-30 个字符');
            }
            if (!req.files.avatar.name) {
                throw new Error('缺少头像');
            }
            if (password.length < 6) {
                throw new Error('密码至少 6 个字符');
            }
            if (password !== rePassword) {
                throw new Error('两次输入密码不一致');
            }
        } catch (e) {
            req.flash('error', e.message);
            return res.redirect('/register');
        }
        // 明文密码加密
        password = sha1(password);
        //密码加密
        var user = new User({
            userName: userName,
            gender: gender,
            avatar: avatar,
            bio: bio,
            password: password,
            createTime:moment(Date.now()).format('YYYY/MM/DD HH:mm:ss')
        });
        user.save(function (err, result) {
            if (err) {
                req.flash('error', '注册失败:'+err.message);
                return res.redirect('/users/register');
            }
            delete user.password;
            req.session.user = user;
            req.flash('success', '注册成功');
            res.redirect('/index');
        });
    },
    /*通过用户名查找用户*/
    findByUserName:function (req,res,next) {
        var userName = req.fields.userName;
        var password = req.fields.password;
        User.findOne({userName: userName})
            .then(function (doc) {
                if (!doc) {
                    req.flash('error', '用户不存在');
                    return res.redirect('/users/login');
                }
                if (sha1(password)!==doc.password) {
                    req.flash('error', '用户名或密码错误');
                    return res.redirect('/users/login');
                }
                req.flash('success', '登录成功');
                // 用户信息写入 session
                delete doc.password;
                req.session.user = doc;
                // 跳转到主页
                res.redirect('/index');
            }).catch(next);
    }
}


