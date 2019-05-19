// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//声明数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  //取得传过来的参数
  var openId = event.openId,
    id = event.id;
  try {
    return await db.collection('collect').where({
      _openid: openId,
      detailId: id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}