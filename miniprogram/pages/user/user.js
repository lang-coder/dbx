Page({
  data: {
    username: '点击登录',
    defaultUrl: '/images/yuyin5.png',
    userTx: '',
    userInfo: {},
    gender: 1,
    province: '',
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的'
    })
    //当重新加载这个页面时，查看是否有已经登录的信息
    let username = wx.getStorageSync('username'),
      avater = wx.getStorageSync('avatar');
    if (username) {
      this.setData({
        username: username,
        userTx: avater
      })
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                userTx: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  getUserInfoHandler: function (e) {
    let d = e.detail.userInfo
    var gen = d.gender == 1 ? '男' : '女'
    this.setData({
      userTx: d.avatarUrl,
      username: d.nickName
    })
    wx.setStorageSync('avater', d.avatarUrl)
    wx.setStorageSync('username', d.nickName)
    wx.setStorageSync('gender', gen)
    wx.setStorageSync('province', d.province)
    //获取数据库引用
    const db = wx.cloud.database()
    const _ = db.command
    //查看是否已有登录，无，则获取id
    var userId = wx.getStorageSync('userId')
    if (!userId) {
      userId = this.getUserId()
    }
    //查找数据库
    db.collection('users').where({
      _openid: d.openid
    }).get({
      success(res) {
        // res.data 是包含以上定义的记录的数组
        //如果查询到数据,将数据记录，否则去数据库注册
        if (res.data && res.data.length > 0) {
          wx.setStorageSync('openId', res.data[0]._openid)
        } else {
          //定时器
          setTimeout(() => {
            //写入数据库
            db.collection('users').add({
              data: {
                userId: userId,
                userSweet: 10,
                voice: 0,
                baovoice: 0,
                iv: d.iv
              },
              success: function () {
                console.log('用户id新增成功')
                db.collection('users').where({
                  userId: userId
                }).get({
                  success: res => {
                    wx.setStorageSync('openId', res.data[0]._openid)
                  },
                  fail: err => {
                    console.log('用户_openId设置失败')
                  }
                })
              },
              fail: function (e) {
                console.log('用户id新增失败')
              }
            })
          }, 100)
        }
      },
      fail: err => {

      }
    })
  },
  getUserId: function () {
    //生产唯一id，采用一个字母或数字+1970年到现在的毫秒数+10w的一个随机数组成
    var w = "abcdefghijklmnopqrstuvwxyz0123456789",
      firstW = w[parseInt(Math.random() * (w.length))];
    var userId = firstW + (Date.now()) + (Math.random() * 100000).toFixed(0)
    wx.setStorageSync('userId', userId)
    return userId;
  },
})