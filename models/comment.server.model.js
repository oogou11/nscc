/**
 * Created by zhangh on 2016/12/2.
 */
var mongoose=require('mongoose');

var comment=new mongoose.Schema({
    uid:{
        type:String,
        required:true,
        default:(new Date()-0).toString()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    news:{
        type:mongoose.Schema.ObjectId,
        ref:'news'
    },
    createTime:{
        type:date,
        default:new Date()
    }
});

mongoose.mode('Comment',comment);