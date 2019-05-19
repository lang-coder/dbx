//录音管理
const recorderManager = wx.getRecorderManager()
var tempFilePath
var sum = 0
var sumt = 0;
Page({
  data: {

  },
  //按钮点下开始录音
  touchdown: function () {
    const options = {
      duration: 300000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 5 //指定帧大小，单位 KB
    }
    //监听帧文件
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      sum += frameBuffer.byteLength
      sumt++
    })
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  touchup: function () {
    wx.showLoading({
      title: '',
      mask: true
    })
    recorderManager.stop();
    if (sumt > 10) {
      var wn = (sum - 1500) / (sumt - 1) - 2300
    } else {
      var wn = (sum - 1500) / (sumt - 1) - 3000
    }
    wx.setStorageSync('wnum', parseInt(wn))
    sum = 0
    sumt = 0
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
      //查询用户已有语音，记录，并为文件赋值
      //获取数据库引用
      const db = wx.cloud.database()
      const _ = db.command
      //查找数据库,获得用户语音数量
      db.collection('users').where({
        _openid: wx.getStorageSync('openId')
      }).get({
        success(res) {
          // res.data 是包含以上定义的记录的数组
          console.log('查询用户:', res)
          //将名字定为id号+个数号+.mp3
          var newbaovoice = res.data[0].baovoice + 1
          var baofilename = wx.getStorageSync('openId') + newbaovoice + '.mp3'
          //调用云函数，修改爆语音数量，向云函数传值
          wx.cloud.callFunction({
            name: 'updateBaovoice',
            data: {
              openId: wx.getStorageSync('openId'),
              baovoice: newbaovoice
            },
            success: res => {
              //上传录制的音频到云
              wx.cloud.uploadFile({
                cloudPath: 'baovoice/' + baofilename,
                filePath: tempFilePath, // 文件路径
                success: res => {
                  console.log(res.fileID)
                  //保存点爆语音fileID，方便后面播放
                  wx.setStorageSync('fileIDd', res.fileID)
                  //将数据保存到本地
                  wx.setStorageSync('baofilename', baofilename)
                  wx.setStorageSync('ybaotempFilePath', tempFilePath)
                  //关闭加载
                  wx.hideLoading()
                  //跳转到听语音的页面
                  wx.navigateTo({
                    url: '../selectyok/selectyok'
                  })
                },
                fail: err => {
                  // handle error
                  console.error(err)
                }
              })
            }
          })
        },
        fail: err => {

        }
      })
    })
    setTimeout((() => {
      //关闭加载
      wx.hideLoading()
    }), 4000)
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '爆炸之音'
    })
  }
})