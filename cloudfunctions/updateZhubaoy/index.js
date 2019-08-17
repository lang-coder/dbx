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
    zhu = event.zhu,
    detailId = event.detailId,
    openId = openId;
  //云函数，更新
  if (zhu) {
    temperature = temperature + 10
  } else {
    temperature = temperature - 10
  }
  try {
    return await db.collection('baoyuyins').where({
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