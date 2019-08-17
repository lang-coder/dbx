var util = require('../../utils/utils.js');
//音频组件控制
const innerAudioContext = wx.createInnerAudioContext()
const db = wx.cloud.database()
const _ = db.command;
Page({
  data: {
    wtemperature: 0,
    theplay: true
  },
  //播放声音
  play: function () {
    if (this.data.theplay) {
      this.setData({
        theplay: false
      })
      innerAudioContext.autoplay = true
      innerAudioContext.src = wx.getStorageSync('ybaotempFilePath'),
        innerAudioContext.onPlay(() => {
          console.log('开始播放')
        }),
        innerAudioContext.onEnded(() => {
          this.setData({
            theplay: true
          })
        })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    }
  },
  //页面被卸载时被执行
  onUnload: function () {
    innerAudioContext.stop();
  },
  //当点击确认后如果语音在播放则关闭
  onHide: function () {
    innerAudioContext.stop()
  },
  //将数据写入数据库
  add: function () {
    wx.showLoading({
      title: '',
      mask: true
    })
    var wy = wx.getStorageSync('wy')
    var detailId = ''
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
        baofilename: wx.getStorageSync('baofilename'),
        fileIDd: wx.getStorageSync('fileIDd'),
        temperature: wx.getStorageSync('wnum'),
        wtime: util.formatTime(new Date())
      }
      db.collection('bao').add({
        data: data,
        success: res => {
          console.log('bao存入成功')
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
            baofilename: wx.getStorageSync('baofilename'),
            fileIDd: wx.getStorageSync('fileIDd'),
            temperature: wx.getStorageSync('wnum'),
            wtime: util.formatTime(new Date()),
            detailId: res._id
          }
          db.collection('userbao').add({
            data: data,
            success: res => {
              console.log('bao存入成功')
            }
          })
          db.collection('baotexts').add({
            data: data,
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
        baofilename: wx.getStorageSync('baofilename'),
        fileIDd: wx.getStorageSync('fileIDd'),
        temperature: wx.getStorageSync('wnum'),
        wtime: util.formatTime(new Date())
      }
      db.collection('bao').add({
        data: data,
        success: res => {
          console.log('bao存入成功')
          data = {
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
            baofilename: wx.getStorageSync('baofilename'),
            fileIDd: wx.getStorageSync('fileIDd'),
            temperature: wx.getStorageSync('wnum'),
            wtime: util.formatTime(new Date()),
            detailId: res._id
          }
          db.collection('userbao').add({
            data: data,
            success: res => {
              console.log('bao存入成功')
            }
          })
          db.collection('baoyuyins').add({
            data: data,
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
  },
  //封存
  fengcun: function(){
    wx.showLoading({
      title: '',
      mask: true
    })
    var wy = wx.getStorageSync('wy')
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
        baofilename: wx.getStorageSync('baofilename'),
        fileIDd: wx.getStorageSync('fileIDd'),
        temperature: wx.getStorageSync('wnum'),
        wtime: util.formatTime(new Date())
      }
      db.collection('fengcun').add({
        data: data,
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
      //单另封存
      // db.collection('fengcuntexts').add({
      //   data: data,
      //   success: res => {
      //     wx.showToast({
      //       title: '封存成功',
      //     })
      //     setTimeout(() => {
      //       wx.navigateTo({
      //         url: '../selectok/selectok'
      //       })
      //     }, 1000)
      //   }
      // })
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
        baofilename: wx.getStorageSync('baofilename'),
        fileIDd: wx.getStorageSync('fileIDd'),
        temperature: wx.getStorageSync('wnum'),
        wtime: util.formatTime(new Date())
      }
      db.collection('fengcun').add({
        data: data,
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
      // db.collection('fengcunyuyins').add({
      //   data: data,
      //   success: res => {
      //     wx.showToast({
      //       title: '封存成功',
      //     })
      //     setTimeout(() => {
      //       wx.navigateTo({
      //         url: '../selectok/selectok'
      //       })
      //     }, 1000)
      //   }
      // })
    }
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '爆炸之音'
    })
    let temperature = wx.getStorageSync('wnum')
    this.setData({
      wtemperature: temperature
    })
  }
})