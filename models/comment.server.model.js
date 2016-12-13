/**
 * Created by zhangh on 2016/12/2.
 */
var mongoose=require('mongoose');

var Comment=new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        required:true,
        ref: 'User'
    },
    news: {
        type: mongoose.Schema.ObjectId,
        required:true,
        ref: 'News'
    },
    content: {
        type: String,
        required: true
    },
    createTime: {
        type:String
    }
});

mongoose.model('Comment',Comment);