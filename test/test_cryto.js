/**
 * Created by zhangh on 2016/11/30.
 */
var async=require('async');
var config=require('../config/error.config');

var abc=123;
async.waterfall([
    function (callback) {
    for(var i=0;i<100;i++){
    }
        callback(103,'300');
    },
    function (callback) {
        callback(null,'error');
    }
],function (err,result) {
    console.log(err);
    console.log(result);
});