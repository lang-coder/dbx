const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({
  data: {
    num: 0,
    btext: '开始',
    disabled: false,
    dok: false
  },
  //如果页面被卸载时被执行
  onUnload: function () {
    backgroundAudioManager.stop();
  },
  //开始计数
  start: function() {
    //如果按钮为开始，进行开始的操作，否则跳转页面
    if(this.data.btext == '开始'){
      let ber = 60
      backgroundAudioManager.title = '点击'
      backgroundAudioManager.epname = '点击'
      backgroundAudioManager.src = 'cloud://xiedong-87d8e0.7869-xiedong-87d8e0/bg/dianjif.mp3'
      //开始技术后让点击变为true可以记录值
      this.setData({
        btext: ber,
        disabled: true,
        dok: true
      })
      //设置秒数减少定时器,减少完后让点击不再计数dok:false
      let dian = setInterval(() => {
        ber--
        if (ber == -1) {
          backgroundAudioManager.stop();
          this.setData({
            btext: '下一步',
            disabled: false,
            dok: false
          })
          clearInterval(dian)
        } else {
          this.setData({
            btext: ber
          })
        }
      }, 1000)
    }else{
      //记录点击数量值到本地
      wx.setStorageSync('wnum', this.data.num)
      wx.navigateTo({
        url: '../selectdok/selectdok'
      })
    }
  },
  //点击,当开始后才记录点击次数
  dianji: function() {
    let n = this.data.num
    if(this.data.dok){
      n++
      this.setData({
        num: n
      })
    }
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '疯狂点击'
    })
  }
})