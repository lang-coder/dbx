Page({
  data: {

  },
  goindex: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  //监听页面自动跳转
  onShow: function () {
    setTimeout(() => {
      wx.reLaunch({
        url: '../index/index',
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    }, 2000)
  },
  onLoad: function () {
    wx.setStorageSync('wtext', '')
    wx.setStorageSync('wmood', 'red')
    wx.setStorageSync('wway', '1')
    wx.setStorageSync('wnum', 0)
  }
})