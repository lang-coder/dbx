Page({
  data: {
    jarray: [],
  },
  onLoad: function () {
    const db = wx.cloud.database()
    var nth = wx.getStorageSync('nth')
    //记录
    if(nth == '1'){
      // nth=1数据
      wx.setNavigationBarTitle({
        title: '点爆记录'
      })
      db.collection('userbao').where({
        _openid: wx.getStorageSync('openId')
      }).orderBy('wtime', 'desc')
        .get({
          success: res => {
            this.setData({
              jarray: res.data
            })
          }
        });
    }
    //最近助点
    if (nth == '2') {
      // nth=2数据
      wx.setNavigationBarTitle({
        title: '最近助点'
      })
      db.collection('zhubao').where({
        _openid: wx.getStorageSync('openId')
      }).orderBy('wtime', 'desc').limit(20)
        .get({
          success: res => {
            this.setData({
              jarray: res.data
            })
          }
        });
    }
    //收藏
    if (nth == '3') {
      // nth=3数据
      wx.setNavigationBarTitle({
        title: '我的收藏'
      })
      db.collection('shoucang').where({
        _openid: wx.getStorageSync('openId')
      }).orderBy('wtime', 'desc')
        .get({
          success: res => {
            console.log('3', res)
            this.setData({
              jarray: res.data
            })
          }
        });
    }
  },
  goopen: function (e) {
    //获取当前内容的标识id，保存，方便进入查询
    var id = e.currentTarget.id
    wx.setStorageSync('id', id)
    wx.navigateTo({
      url: '../detail/detail',
    });
  }
})