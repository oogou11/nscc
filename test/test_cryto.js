/**
 * Created by zhangh on 2016/11/30.
 */
var async=require('async');
var config=require('../config/error.config');
var one=require('./one');

var abc=123;
async.waterfall([
    function (callback) {
        one.testone(function (err,result) {
            if(err){
                callback(err,'失败');
            }
            callback(-1,'123');
        });
    },
    function (info,callback) {
        callback(null,'error');
    },
    function (info,callback) {
        callback(null,'操作成功')
    }
],function (err,result) {
    console.log(err);
    console.log(result);
});