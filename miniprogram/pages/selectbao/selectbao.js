Page({
  data: {
    wway: '爆炸之音'
  },
  selectway: function(e) {
    this.setData({
      wway: e.detail.value
    })
  },
  next: function () {
    let wway = this.data.wway
    wx.setStorageSync('wway', wway)
    if (wway == '爆炸之音'){
      wx.navigateTo({
        url: '../selecty/selecty'
      })
    } else if (wway == '疯狂点击'){
      wx.navigateTo({
        url: '../selectd/selectd'
      })
    }else{
      wx.navigateTo({
        url: '../selectt/selectt'
      })
    }
  },
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: '点爆方式'
    })
  }
})