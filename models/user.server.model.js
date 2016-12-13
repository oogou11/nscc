/**
 * Created by zhangh on 2016/11/28.
 */
var mongoose=require('mongoose');

var UserSchema=new mongoose.Schema({
    /*用户名登录账号*/
    userName:{
        type:String,
        required:true
    },
    /*性别*/
    gender:String,
    /*邮箱*/
    email:String,
    /*头像*/
    avatar:String,
    /*简介*/
    bio:String,
    /*密码：加密*/
    password:{
        type:String,
        required:true
    },
    /*电话：手机短信验证*/
    phone:{
        type:String
    },
    /*创建时间*/
    createTime:{
        type:String
    },
    /*是否删除*/
    delete:{
        type:Number,
        default:0
    }
});

mongoose.model('User',UserSchema);