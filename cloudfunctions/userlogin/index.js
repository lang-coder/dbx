// 云函数入口文件
const cloud = require('wx-server-sdk')

wx.cloud.init({
  env: 'xiedong-87d8e0',
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    openid:event.userInfo.openId,
  }
}