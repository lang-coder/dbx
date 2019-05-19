var util = require('../../utils/utils.js');

const db = wx.cloud.database()
const _ = db.command;
Page({
  data: {
    userSweet: 0,
    wnum: 0,
    t: 0
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '糖果点爆'
    })
    db.collection('users').where({
      _openid: wx.getStorageSync('openId')
    }).get({
      success: res => {
        this.setData({
          userSweet: res.data[0].userSweet
        })
      },
      fail: console.error
    })
  },
  setSweet: function (event) {
    var sweet = event.detail.value
    this.setData({
      wnum: sweet * 100,
      t: sweet
    })
  },
  add: function () {
    wx.showLoading({
      title: '',
      mask: true
    })
    //判断糖果输入
    if (this.data.t == 0 || this.data.t > this.data.userSweet) {
      wx.showToast({
        title: '糖糖有误',
      })
      this.setData({
        t: 0,
        wnum: 0
      })
      return
    }
    var wy = wx.getStorageSync("wy")
    if (wy == "w") {
      var data = {
        userId: wx.getStorageSync('userId'),
        openId: wx.getStorageSync('openId'),
        username: wx.getStorageSync('username'),
        gender: wx.getStorageSync('gender'),
        province: wx.getStorageSync('province'),
        avaterUrl: wx.getStorageSync('avater'),
        wtext: wx.getStorageSync('wtext'),
        wmood: wx.getStorageSync('wmood'),
        wway: wx.getStorageSync('wway'),
        temperature: this.data.wnum,
        wtime: util.formatTime(new Date())
      }
    } else {
      var data = {
        userId: wx.getStorageSync('userId'),
        openId: wx.getStorageSync('openId'),
        username: wx.getStorageSync('username'),
        gender: wx.getStorageSync('gender'),
        province: wx.getStorageSync('province'),
        avaterUrl: wx.getStorageSync('avater'),
        filename: wx.getStorageSync('filename'),
        fileIDy: wx.getStorageSync('fileIDy'),
        ymood: wx.getStorageSync('ymood'),
        yway: wx.getStorageSync('wway'),
        temperature: this.data.wnum,
        wtime: util.formatTime(new Date())
      }
    }
    db.collection('bao').add({
      data: data,
      success: res => {
        console.log('bao存入成功')
        var newSweet = this.data.userSweet - this.data.t
        //调用云函数，修改糖果数量
        wx.cloud.callFunction({
          name: 'updateSweet',
          data: {
            openId: wx.getStorageSync('openId'),
            userSweet: newSweet
          },
          success: res => {
            wx.showToast({
              title: '点爆成功',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '../success/success'
              })
            }, 1000)
            wx.hideLoading()
          }
        })
      }
    })
  },
  seal: function () {
    //判断糖果输入
    if (this.data.t == 0 || this.data.t > this.data.userSweet) {
      wx.showToast({
        title: '糖糖有误',
      })
      this.setData({
        t: 0,
        wnum: 0
      })
      return
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    var wy = wx.getStorageSync("wy")
    if (wy == "w") {
      var data = {
        userId: wx.getStorageSync('userId'),
        openId: wx.getStorageSync('openId'),
        username: wx.getStorageSync('username'),
        gender: wx.getStorageSync('gender'),
        province: wx.getStorageSync('province'),
        avaterUrl: wx.getStorageSync('avater'),
        wtext: wx.getStorageSync('wtext'),
        wmood: wx.getStorageSync('wmood'),
        wway: wx.getStorageSync('wway'),
        temperature: this.data.wnum,
        wtime: util.formatTime(new Date())
      }
    } else {
      var data = {
        userId: wx.getStorageSync('userId'),
        openId: wx.getStorageSync('openId'),
        username: wx.getStorageSync('username'),
        gender: wx.getStorageSync('gender'),
        province: wx.getStorageSync('province'),
        avaterUrl: wx.getStorageSync('avater'),
        filename: wx.getStorageSync('filename'),
        fileIDy: wx.getStorageSync('fileIDy'),
        ymood: wx.getStorageSync('ymood'),
        yway: wx.getStorageSync('wway'),
        temperature: this.data.wnum,
        wtime: util.formatTime(new Date())
      }
    }
    db.collection('seal').add({
      data: data,
      success: res => {
        console.log('seal存入成功')
        var newSweet = this.data.userSweet - this.data.t
        //调用云函数，修改糖果数量
        wx.cloud.callFunction({
          name: 'updateSweet',
          data: {
            openId: wx.getStorageSync('openId'),
            userSweet: newSweet
          },
          success: res => {
            wx.showToast({
              title: '点爆成功',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '../selectok/selectok'
              })
            }, 1000)
            wx.hideLoading()
          }
        })
      }
    })
  },
})