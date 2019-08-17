const db = wx.cloud.database();
var _innerAudioContext;
Page({
  data: {
    detail:{},
    userInfo: {},
    temperature: 0,//热度
    zhu: true,//判断是助爆还是取消助爆
    zhubtn: '助爆',//控制助爆按钮
    wy: 1,//判断是文爆还是音爆，为相应数据库更新
    shouimage: 'https://7869-xiedong-87d8e0-1258852857.tcb.qcloud.la/images/shoucang.png?sign=5b7ce2230955a686054477f563636044&t=1554273994',//收藏图标
    cang: '收藏',//判断收藏文字变化
    fileIDd: '',//爆炸之音
    fileIDy: '',//语音
    theplay: true,//判断是否在播放声音,
    im1: false,
    im2: false,
    zhunumber: 0,
  },
  //助爆
  zhubao: function(){
    //向助爆表中增加,传入这两个值方便保存，和查找删除
    var detailId = this.data.detail._id
    var openId = wx.getStorageSync('openId')
    if(this.data.zhu){
      //调用云函数，修改热度数量，向云函数传值，对bao数据库更新
      wx.cloud.callFunction({
        name: 'updateZhubao',
        data: {
          id: this.data.detail._id,
          temperature: this.data.temperature,
          zhu: this.data.zhu,
          detailId: detailId,
          openId: openId
        },
        success: res => {
          //判断文爆与音爆，对两个数据库更新
          if(this.data.wy == 1){
            //调用云函数，修改热度数量，向云函数传值
            wx.cloud.callFunction({
              name: 'updateZhubaow',
              data: {
                id: this.data.detail._id,
                temperature: this.data.temperature,
                zhu: this.data.zhu,
                detailId: detailId,
                openId: openId
              },
              success: res => {
                
              }
            })
          }else{
            wx.cloud.callFunction({
              name: 'updateZhubaoy',
              data: {
                id: this.data.detail._id,
                temperature: this.data.temperature,
                zhu: this.data.zhu,
                detailId: detailId,
                openId: openId
              },
              success: res => {
                
              }
            })
          }
          //向助爆表中增加,取消助爆时在云函数中完成(这些记录用于我的页面)
          var detailId = this.data.detail._id
          var wway = this.data.detail.wway
          var yway = this.data.detail.yway
          var wtext = this.data.detail.wtext
          var temperature = this.data.detail.temperature
          var filename = this.data.detail.filename
          db.collection('zhubao').add({
            data: {
              detailId: detailId,
              wtext: wtext,
              wway: wway,
              yway: yway,
              temperature: temperature,
              filename: filename
            },
            success: function () {
              console.log('增加成功')
            },
            fail: function (e) {
              console.error(e)
            }
          })
          this.setData({
            zhu: false,
            zhubtn: '已助爆',
            temperature: this.data.temperature + 10
          })
          wx.showToast({
            title: '助爆成功',
          })
        }
      })
    }else{
      //调用云函数，修改热度数量，向云函数传值
      wx.cloud.callFunction({
        name: 'updateZhubao',
        data: {
          id: this.data.detail._id,
          temperature: this.data.temperature,
          zhu: this.data.zhu,
          detailId: detailId,
          openId: openId
        },
        success: res => {
          if (this.data.wy == 1) {
            //调用云函数，修改热度数量，向云函数传值
            wx.cloud.callFunction({
              name: 'updateZhubaow',
              data: {
                id: this.data.detail._id,
                temperature: this.data.temperature,
                zhu: this.data.zhu,
                detailId: detailId,
                openId: openId
              },
              success: res => {

              }
            })
          } else {
            wx.cloud.callFunction({
              name: 'updateZhubaoy',
              data: {
                id: this.data.detail._id,
                temperature: this.data.temperature,
                zhu: this.data.zhu,
                detailId: detailId,
                openId: openId
              },
              success: res => {

              }
            })
          }
          this.setData({
            zhu: true,
            zhubtn: '助爆',
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
  shoucang: function(){
    //在异步success中不能用this要用var that
    var that = this
    var detailId = this.data.detail._id
    //变换收藏
    if(this.data.cang == '收藏'){
      var img = 'https://7869-xiedong-87d8e0-1258852857.tcb.qcloud.la/images/usercang.png?sign=56ee76d7b3d3ef455fb1b6b251b2ad48&t=1554274644'
      var detailId = this.data.detail._id
      var wway = this.data.detail.wway
      var yway = this.data.detail.yway
      var wtext = this.data.detail.wtext
      var temperature = this.data.detail.temperature
      var filename = this.data.detail.filename
      db.collection('shoucang').add({
        data: {
          detailId: detailId,
          wtext: wtext,
          wway: wway,
          yway: yway,
          temperature: temperature,
          filename: filename
        },
        success: function () {
          that.setData({
            shouimage: img,
            cang: '已收藏'
          })
          console.log('收藏成功')
        },
        fail: function (e) {
          console.log('')
        }
      })
    }else{
      var img = 'https://7869-xiedong-87d8e0-1258852857.tcb.qcloud.la/images/shoucang.png?sign=5b7ce2230955a686054477f563636044&t=1554273994'
      wx.cloud.callFunction({
        name: 'removeShoucang',
        data: {
          id: this.data.detail._id,
          openId: wx.getStorageSync('openId')
        },
        success: res => {
          that.setData({
            shouimage: img,
            cang: '收藏'
          })
          console.log('取消收藏')
        }
      })
    }
  },
  //第一个语音按钮播放
  playone: function (){
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
        console.log(res.errCode)
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
    _innerAudioContext.stop();
  },
  //查询出点爆数据，并初始化各个需要用的参数
  onLoad: function(){
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
          if(res.data[0].wtext){
            wy = 1
          }else{
            wy = 2
          }
          that.setData({
            detail: res.data[0],
            temperature: res.data[0].temperature,
            wy: wy
          })
          //查询当前文章是不是当前用户已经收藏的，如果是变换收藏图标
          db.collection('shoucang').where({
            _openid: wx.getStorageSync('openId'),
            detailId: this.data.detail._id
          }).get({
            success(res){
              //如果返回值存在且有数据
              if(res.data && res.data.length>0){
                var img = 'https://7869-xiedong-87d8e0-1258852857.tcb.qcloud.la/images/usercang.png?sign=56ee76d7b3d3ef455fb1b6b251b2ad48&t=1554274644'
                that.setData({
                  shouimage: img,
                  cang: '已收藏'
                })
              }
            }
          })
          //查询当前文章是不是当前用户已经助爆
          db.collection('zhubao').where({
            _openid: wx.getStorageSync('openId'),
            detailId: this.data.detail._id
          }).get({
            success(res) {
              //结束加载按钮
              wx.hideLoading()
              //如果返回值存在且有数据
              if (res.data && res.data.length > 0) {
                that.setData({
                  zhu: false,
                  zhubtn: '已助爆'
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
    return{
      title: '我要点爆',
      desc: '帮我点爆',
      path: '/pages/detail/detail?id=' + id + "1",
    }
  }
})