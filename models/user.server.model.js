/**
 * Created by zhangh on 2016/11/28.
 */
var mongoose=require('mongoose');

//用户Schema
var UserSchema=new mongoose.Schema({
    uid:{
        type:Number,
        unique:true
    },
    userName:{
        type:String,
        require:true
    },
    email:String,
    password:String,
    phone:String,
    createTime:{
        type:Date,
        default:Date.now
    },
    delete:Number
});

UserSchema.statics.findByUid=function (uid,cb) {
    this.findOne({uid:uid},function (err,users) {
        if(err){
            cb(err,null);
        }
        cb(null,users);
    });
}
mongoose.model('User',UserSchema);