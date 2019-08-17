const db = wx.cloud.database()
Page({
  data: {
    detail: {},
    userInfo: {},
    temperature: 0,//热度
    wy: 1,//判断是文爆还是音爆，为相应数据库更新
    fileIDd: '',//爆炸之音
    fileIDy: '',//语音
  },
  playone: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.detail.fileIDy
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  playtwo: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.detail.fileIDd
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  //查询出点爆数据，并初始化各个需要用的参数
  onLoad: function () {
    var that = this
    //取出标识id，查询
    var id = wx.getStorageSync('id')
    // 查询数据，初始化数据和判断值wy
    db.collection('fengcun').where({
      _id: id
    }).get({
      success: res => {
        var wy = 1
        if (res.data[0].wtext) {
          wy = 1
        } else {
          wy = 2
        }
        that.setData({
          detail: res.data[0],
          temperature: res.data[0].temperature,
          wy: wy
        })
      }
    });
  }
})