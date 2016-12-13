/**
 * Created by zhangh on 2016/11/29.
 */
var mongoose=require('mongoose');

var News=new mongoose.Schema({
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
    /*作者信息 外键*/
    author:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    /*点击量*/
    pv:{
        type:Number
    },
    /*创建时间*/
    createTime:{
        type:String
    }
});
mongoose.model('News',News);
