/**
 * Created by zhangh on 2016/11/28.
 * 配置文件设置成模块，方便导出
 */
module.exports={
    mongodb:'mongodb://localhost/nscc',
    session:{
        secret: 'test_asking',
        key:'test_asking_2016',
        maxAge: 2592000000
    }
}