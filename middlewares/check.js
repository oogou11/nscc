/**
 * Created by zhangh on 2016/12/6.
 */
module.exports={
    checkLogin:function (req,res,next) {
        if (!req.session.user) {
            req.flash('error', '未登录');
            res.redirect('/users/login');
        }
        next();
    },
    checkNotLogin:function (req,res,next) {
        if (req.session.user) {
            req.flash('error', '已登录');
            res.redirect('/index');//返回之前的页面
        }
        next();
    }
}