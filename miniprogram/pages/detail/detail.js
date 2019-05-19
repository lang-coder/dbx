const db = wx.cloud.database();
var _innerAudioContext;
Page({
  data: {
    detail: {},
    userInfo: {},
    temperature: 0,//热度
    boost: true,//判断是助爆还是取消助爆
    boostText: '助爆',//控制助爆按钮
    wy: 1,//判断是文爆还是音爆，为相应数据库更新
    collectimage: '/images/shoucang.png',//收藏图标
    collectText: '收藏',//判断收藏文字变化
    fileIDd: '',//爆炸之音
    fileIDy: '',//语音
    theplay: true,//判断是否在播放声音,
    im1: false,//控制显示语音播放样式
    im2: false,
    boostNumber: 0,
  },
  //助爆
  boost: function () {
    //向助爆表中增加,传入这两个值方便保存，和查找删除
    var detailId = this.data.detail._id
    var openId = wx.getStorageSync('openId')
    if (this.data.boost) {
      //调用云函数，修改热度数量，向云函数传值，对bao数据库更新
      wx.cloud.callFunction({
        name: 'updateBoost',
        data: {
          id: this.data.detail._id,
          temperature: this.data.temperature,
          boost: this.data.boost,
          detailId: detailId,
          openId: openId
        },
        success: res => {
          var detailId = this.data.detail._id
          db.collection('boost').add({
            data: {
              detailId: detailId
            },
            success: function () {
              console.log('增加成功')
            },
            fail: function (e) {
              console.error(e)
            }
          })
          this.setData({
            boost: false,
            boostText: '已助爆',
            temperature: this.data.temperature + 10
          })
          wx.showToast({
            title: '助爆成功',
          })
        }
      })
    } else {
      //调用云函数，修改热度数量，向云函数传值
      wx.cloud.callFunction({
        name: 'updateBoost',
        data: {
          id: this.data.detail._id,
          temperature: this.data.temperature,
          boost: this.data.boost,
          detailId: detailId,
          openId: openId
        },
        success: res => {
          this.setData({
            boost: true,
            boostText: '助爆',
            temperature: this.data.temperature - 10
          })
          wx.showToast({
            title: '已取消助爆',
          })
        }
      })
    }
  },
  //收藏按钮
  collect: function () {
    //在异步success中不能用this要用var that
    var that = this
    var detailId = this.data.detail._id
    //变换收藏
    if (this.data.collectText == '收藏') {
      var img = '/images/usercang.png'
      var detailId = this.data.detail._id
      db.collection('collect').add({
        data: {
          detailId: detailId
        },
        success: function () {
          that.setData({
            collectimage: img,
            collectText: '已收藏'
          })
          console.log('收藏成功')
        },
        fail: function (e) {
          console.log(e)
        }
      })
    } else {
      var img = '/images/shoucang.png'
      wx.cloud.callFunction({
        name: 'removeCollect',
        data: {
          id: this.data.detail._id,
          openId: wx.getStorageSync('openId')
        },
        success: res => {
          that.setData({
            collectimage: img,
            collectText: '收藏'
          })
          console.log('取消收藏')
        }
      })
    }
  },
  //第一个语音按钮播放
  playone: function () {
    if (this.data.theplay) {
      this.setData({
        theplay: false,
        im1: true,
      })
      const innerAudioContext = wx.createInnerAudioContext()
      _innerAudioContext = innerAudioContext
      innerAudioContext.autoplay = true
      innerAudioContext.src = this.data.detail.fileIDy
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      }),
        innerAudioContext.onEnded(() => {
          this.setData({
            theplay: true,
            im1: false,
          })
        })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
      })
    }
  },
  //第二个语音按钮播放
  playtwo: function () {
    if (this.data.theplay) {
      this.setData({
        theplay: false,
        im2: true,
      })
      const innerAudioContext = wx.createInnerAudioContext()
      _innerAudioContext = innerAudioContext
      innerAudioContext.autoplay = true
      innerAudioContext.src = this.data.detail.fileIDd
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      }),
        innerAudioContext.onEnded(() => {
          this.setData({
            theplay: true,
            im2: false,
          })
        })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    }
  },
  //如果页面被卸载时被执行，关掉所有正在播放的语音
  onUnload: function () {
    if (_innerAudioContext){
      _innerAudioContext.stop();
    }
  },
  //查询出点爆数据，并初始化各个需要用的参数
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    //取出标识id，查询
    var id = wx.getStorageSync('id')
    // 查询数据，初始化数据和判断值wy
    db.collection('bao').where({
      _id: id
    }).get({
      success: res => {
        var wy = 1
        if (res.data[0].text) {
          wy = 1
        } else {
          wy = 2
        }
        that.setData({
          detail: res.data[0],
          temperature: res.data[0].temperature,
          wy: wy
        })
        //查询当前文章是不是当前用户已经收藏的，如果是变换收藏图标
        db.collection('collect').where({
          _openid: wx.getStorageSync('openId'),
          detailId: this.data.detail._id
        }).get({
          success(res) {
            //如果返回值存在且有数据
            if (res.data && res.data.length > 0) {
              var img = '/images/usercang.png'
              that.setData({
                collectimage: img,
                collectText: '已收藏'
              })
            }
          }
        })
        //查询当前文章是不是当前用户已经助爆
        db.collection('boost').where({
          _openid: wx.getStorageSync('openId'),
          detailId: this.data.detail._id
        }).get({
          success(res) {
            //结束加载按钮
            wx.hideLoading()
            //如果返回值存在且有数据
            if (res.data && res.data.length > 0) {
              that.setData({
                boost: false,
                boostText: '已助爆'
              })
            }
          }
        })
      }
    });
  },
  //分享
  onShareAppMessage: function () {
    var detailId = this.data.detail._id
    var id = wx.getStorageSync('id')
    return {
      title: '我要点爆',
      desc: '帮我点爆',
      path: '/pages/detail/detail?id=' + id + "1",
    }
  }
})