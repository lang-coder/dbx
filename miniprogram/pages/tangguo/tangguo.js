var util = require('../../utils/utils.js');

const db = wx.cloud.database()
const _ = db.command;
Page({
  data: {
    qian: '签到',
    userTang: 0,
  },
  qiandao: function(){
    if(this.data.qian == '签到'){
      var newTang = this.data.userTang + 1
      //调用云函数，修改糖果数量，向云函数传值
      wx.cloud.callFunction({
        name: 'updateTang',
        data: {
          openId: wx.getStorageSync('openId'),
          userTang: newTang
        },
        success: res => {
          this.setData({
            qian: '已签到',
            userTang: newTang
          })
          db.collection('qiandao').where({
            _openid: wx.getStorageSync('openId')
          }).get({
              success: res => {
                if (res.data.length == 0) {
                  //保存签到当前日期
                  db.collection('qiandao').add({
                    data: {
                      time: util.formaDate(new Date()),
                    },
                    success: res => {
                      console.log('qiandao存入成功')
                    }
                  })
                }else{
                  wx.cloud.callFunction({
                    name: 'updateQiandao',
                    data: {
                      openId: wx.getStorageSync('openId'),
                      time: util.formaDate(new Date())
                    },
                    success: res => {
                      console.log('更新成功')
                    }
                  })
                }
              }
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('users').where({
      _openid: wx.getStorageSync('openId')
    }).get({
      success: res => {
        this.setData({
          userTang: res.data[0].userTang
        })
      },
      fail: console.error
    })
    db.collection('qiandao').where({
      _openid: wx.getStorageSync('openId')
    }).get({
      success: res => {
        if (res.data[0].time < util.formaDate(new Date())){
          this.setData({
            qian: '签到'
          })
        }else{
          this.setData({
            qian: '已签到'
          })
        }
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})