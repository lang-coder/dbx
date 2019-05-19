//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    navber: ['推荐', '文爆', '音爆', '爆榜'],
    currentTab: 0,
    tarray: [],
    barray: [],
    lnum1: 20,//记录当前已有数据数量
    stext: '',
    scrollTop: 0,
  },
  //上导航切换
  navbarTap: function (e) {
    this.setData({
      scrollTop: 0
    })
    this.setData({
      currentTab: e.currentTarget.dataset.index
    })
  },
  search: function (e) {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const db = wx.cloud.database()
    // 推荐数据
    db.collection('bao').orderBy('time', 'desc').limit(20)
      .get({
        success: res => {
          this.setData({
            tarray: res.data
          })
        }
      });
    // 排行数据
    db.collection('bao').orderBy('temperature', 'desc').limit(20)
      .get({
        success: res => {
          this.setData({
            barray: res.data
          })
        }
      });
    //模拟加载
    setTimeout(function () {
      wx.hideLoading()
    }, 1500);
  },
  goopen: function (e) {
    //获取当前内容的标识id，保存，方便进入查询
    var id = e.currentTarget.id
    wx.setStorageSync('id', id)
    wx.navigateTo({
      url: '../detail/detail',
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const db = wx.cloud.database()
    // 推荐数据
    db.collection('bao').orderBy('time', 'desc').limit(20)
      .get({
        success: res => {
          this.setData({
            tarray: res.data
          })
        }
      });
    // 排行数据
    db.collection('bao').orderBy('temperature', 'desc').limit(20)
      .get({
        success: res => {
          this.setData({
            barray: res.data
          })
        }
      });
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      wx.hideLoading()
    }, 1500);
  },
  //上拉加载
  thebottom: function () {
    var lnum1 = this.data.lnum1
    const db = wx.cloud.database()
    if (this.data.currentTab == 0) {
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      // 推荐数据
      db.collection('bao').orderBy('wtime', 'desc').skip(lnum1).limit(10)
        .get({
          success: res => {
            this.setData({
              tarray: this.data.tarray.concat(res.data),
              lnum1: lnum1 + 10
            })
            // 隐藏加载框
            wx.hideLoading()
          }
        });
    }
  }
})
