// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//声明数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  //取得传过来的参数
  var temperature = event.temperature,
    id = event.id,
    boost = event.boost,
    detailId = event.detailId,
    openId = openId;
  //云函数，更新
  if (boost) {
    temperature = temperature + 10
  } else {
    temperature = temperature - 10
    try {
      db.collection('boost').where({
        openId: openId,
        detailId: detailId,
      }).remove()
    } catch (e) {
      console.error(e)
    }
  }
  try {
    return await db.collection('bao').where({
      _id: id
    }).update({
      data: {
        temperature: temperature
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