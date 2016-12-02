/**
 * Created by zhangh on 2016/11/29.
 */
var mongoose=require('mongoose');

var NewsSchema=new mongoose.Schema({
    /*主键*/
    uid:{
        type:String,
        required:true
    },
    /*标题*/
    title:{
        type:String,
        required:true
    },
    /*内容*/
    content:{
        type:String,
        required:true
    },
    /*创建时间*/
    createDate:{
        type:Date,
        default:Date.now
    },
    /*作者信息 外键*/
    author:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
});

mongoose.model('News',NewsSchema);
