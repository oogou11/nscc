/**
 * Created by zhangh on 2016/11/28.
 */
var mongoose=require('mongoose');
var config=require('./default');

module.exports=function () {
    //连接数据库
    var db=mongoose.connect(config.mongodb);
    require('../models/user.server.model');
    require('../models/news.server.model');
    require('../models/comment.server.model');
    return db;
}