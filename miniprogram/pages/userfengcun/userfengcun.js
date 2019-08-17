Page({
  data: {
    farray: []
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '封存'
    })
    const db = wx.cloud.database()
    db.collection('fengcun').orderBy('wtime', 'desc')
      .get({
        success: res => {
          console.log(res)
          this.setData({
            farray: res.data
          })
        }
      });
  },
  goopen: function (e) {
    //获取当前内容的标识id，保存，方便进入查询
    var id = e.currentTarget.id
    wx.setStorageSync('id', id)
    //页面跳转,switchTab可跳tabBar
    wx.navigateTo({
      url: '../detailcun/detailcun',
      //跳转时调用页面加载方法，重新加载页面
      // success: function (e) {
      //   var page = getCurrentPages().pop();
      //   if (page == undefined || page == null) return;
      //   page.onLoad();
      // }
    });
  }
})