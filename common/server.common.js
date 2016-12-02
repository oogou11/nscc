/**
 * Created by zhangh on 2016/12/1.
 */
var crypto = require('crypto');
var hash = crypto.createHash("md5");

module.exports={
    /*加密*/
    encryption:function (para,cb) {
        hash.update(new Buffer(para, "binary"));
        var encode = hash.digest('hex');
        return cb(null,encode);
    }
}



