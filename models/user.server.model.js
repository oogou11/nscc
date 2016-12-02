/**
 * Created by zhangh on 2016/11/28.
 */
var mongoose=require('mongoose');

var UserSchema=new mongoose.Schema({
    /*自增长主键 格式：年月日时分秒 4位随机数*/
    uid:{
        type:String,
        unique:true,
        required:true
    },
    /*用户名登录账号*/
    userName:{
        type:String,
        required:true
    },
    /*邮箱*/
    email:String,
    /*密码：加密*/
    password:{
        type:String,
        required:true
    },
    /*电话：手机短信验证*/
    phone:{
        type:String,
        required:true
    },
    /*创建时间*/
    createTime:{
        type:Date,
        default:Date.now
    },
    /*是否删除*/
    delete:{
        type:Number,
        default:0
    }
});

mongoose.model('User',UserSchema);