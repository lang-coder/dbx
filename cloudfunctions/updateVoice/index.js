console.log("4")
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
//声明数据库
const db = cloud.database()
console.log("3")
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("2")
  //取得传过来的参数
  var voice = event.voice, openId = event.openId;
  //云函数，更新
  try {
    return await db.collection('users').where({
      _openid: openId
    }).update({
      data: {
        voice: voice
      },
      success: res => {
        console.log('云函数成功')
      },
      fail: e => {
        console.error(e)
      }
    })
  } catch (e) {
    console.error(e)
  }
}