//音频组件控制
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    navber: ['文字记录', '语音记录'],
    currentTab: 2,
    ymood: '红色',
    theplay: true
  },
  //播放声音
  play: function () {
    if(this.data.theplay){
      this.setData({
        theplay: false
      })
      innerAudioContext.autoplay = true
      innerAudioContext.src = wx.getStorageSync('ytempFilePath'),
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
  //页面被卸载时执行
  onUnload: function () {
    innerAudioContext.stop()
  },
  //当点击下一步后如果语音在播放则关闭
  onHide: function () {
    innerAudioContext.stop()
  },
  //音爆，单选按钮组
  changeMood: function (e) {
    this.setData({
      ymood: e.detail.value
    })
  },
  //音爆，点爆按钮跳转
  dianbao: function (e) {
    let ymood = this.data.ymood
    var wy = 'y'
    //将数据保存到本地,保存语音判断
    wx.setStorageSync('ymood', ymood)
    wx.setStorageSync('wy', wy)
    //跳转页面
    wx.navigateTo({
      url: '../selectbao/selectbao'
    })
  },
})