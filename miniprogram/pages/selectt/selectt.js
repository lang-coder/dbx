var util = require('../../utils/utils.js');

const db = wx.cloud.database()
const _ = db.command;
Page({
  data: {
    userTang: 0,
    wnum: 0,
    t: 0
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '糖果点爆'
    })
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
  },
  setTang: function(event){
    var tang = event.detail.value
    this.setData({
      wnum: tang*100,
      t: tang
    })
  },
  add: function() {
    wx.showLoading({
      title: '',
      mask: true
    })
    //判断糖果输入
    if (this.data.t == 0 || this.data.t > this.data.userTang){
      wx.showToast({
        title: '糖糖有误',
      })
      this.setData({
        t: 0,
        wnum: 0
      })
      return
    }
    var wy = wx.getStorageSync('wy')
    var detailId = ''
    //保存数据
    if(wy == 'w'){
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
      db.collection('bao').add({
        data: data,
        success: res => {
          console.log('bao存入成功')
          detailId = res._id
          data = {
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
            wtime: util.formatTime(new Date()),
            detailId: res._id
          }
          db.collection('userbao').add({
            data: data,
            success: res => {
              console.log('userbao')
            }
          })
          db.collection('baotexts').add({
            data: data,
            success: res => {
              var newTang = this.data.userTang - this.data.t
              //调用云函数，修改糖果数量，向云函数传值
              wx.cloud.callFunction({
                name: 'updateTang',
                data: {
                  openId: wx.getStorageSync('openId'),
                  userTang: newTang
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
        }
      })
    }
    if(wy == 'y'){
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
      //存到公共表
      db.collection('bao').add({
        data: data,
        success: res => {
          console.log('bao存入成功')
          detailId = res._id
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
            wtime: util.formatTime(new Date()),
            detailId: res._id
          }
          //用户点爆记录表
          db.collection('userbao').add({
            data: data,
            success: res => {
              console.log('userbao存入成功')
            }
          })
          db.collection('baoyuyins').add({
            data: data,
            success: res => {
              var newTang = this.data.userTang - this.data.t
              //调用云函数，修改糖果数量，向云函数传值
              wx.cloud.callFunction({
                name: 'updateTang',
                data: {
                  openId: wx.getStorageSync('openId'),
                  userTang: newTang
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
        }
      })
    }
  },
  fengcun: function(){
    //判断糖果输入
    if (this.data.t == 0 || this.data.t > this.data.userTang) {
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
    var wy = wx.getStorageSync('wy')
    //保存数据
    if (wy == 'w') {
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
      db.collection('fengcun').add({
        data: data,
        success: res => {
          var newTang = this.data.userTang - this.data.t
          //调用云函数，修改糖果数量，向云函数传值
          wx.cloud.callFunction({
            name: 'updateTang',
            data: {
              openId: wx.getStorageSync('openId'),
              userTang: newTang
            },
            success: res => {
              wx.showToast({
                title: '封存成功',
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
    }
    if (wy == 'y') {
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
      db.collection('fengcun').add({
        data: data,
        success: res => {
          var newTang = this.data.userTang - this.data.t
          //调用云函数，修改糖果数量，向云函数传值
          wx.cloud.callFunction({
            name: 'updateTang',
            data: {
              openId: wx.getStorageSync('openId'),
              userTang: newTang
            },
            success: res => {
              wx.showToast({
                title: '封存成功',
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
    }
  },
})