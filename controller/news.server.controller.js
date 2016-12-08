/**
 * Created by zhangh on 2016/11/29.
 */
var mongoose=require('mongoose');
var News=mongoose.model('News');
var Users=mongoose.model('User');
var async=require('async');
var marked=require('marked');


module.exports= {
    /*新增文章*/
    create_news: function (req, res, next) {
        var uid=req.session.user.uid;
        var title = req.fields.title;
        var content = req.fields.content;
        async.waterfall([
            function (callback) {
                if(!title.length){
                    callback(-1,'请填写标题');
                }
                if(!content.length){
                    callback(-1,'请填写内容');
                }
                callback(null,'');
            },
            function (user,callback) {
                Users.findOne({uid:uid},function (err,user) {
                   if(err){
                       callback(-1,uid+"不存在");
                   }
                   if(!user){
                       callback(-1,'用户不存在');
                   }
                   callback(null,user);
                });
            },
            function (user,callback) {
                var news=new News({
                    title:title,
                    content:content,
                    author:user,
                    pv:0
                });
                news.save(function (err) {
                    if(err){
                        callback(-1,'服务端异常,请联系管理员');
                    }
                    callback(null,news._id);
                });
            }
        ],function (err,result) {
            if(err){
                req.flash('error',result);
                res.redirect('/news/create');
            } else{
                req.flash('success','操作成功');
                res.redirect('/news/'+result);
            }
        });
    },
    /*根据ObjId查找news*/
    findNewsById:function (req,res,next) {
        var news_objId=req.param.news_uid;
        News.findOne({_id:news_objId})
            .populate({path:'author',model:'User'})
            .contentToHtml()
            .exec();
    }
}