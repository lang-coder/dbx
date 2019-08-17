// pages/sousuo/sousuo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tarray: [],
    stext: '',
    bol: false,
  },
  sousuo: function () {
    wx.showLoading({
      title: '玩命加载中',
    })
    this.setData({
      tarray: []
    })
    //连接数据库
    const db = wx.cloud.database()
    var that = this
    var value = this.data.stext
    db.collection('bao').where({
        _id: value
    }).get({
      success: res => {
        console.log(res)
        if (res.data.length == 0){
          db.collection('bao').where({
            //使用正则查询，实现对搜索的模糊查询
            wtext: db.RegExp({
              regexp: value,
              //从搜索栏中获取的value作为规则进行匹配。
              options: 'im',
              //大小写不区分
            })
          }).get({
            success: res => {
              console.log(res)
              if (res.data.length == 0) {
                that.setData({
                  bol: true
                })
              } else {
                that.setData({
                  tarray: res.data
                })
              }
              wx.hideLoading()
            }
          })
        }else{
          that.setData({
            tarray: res.data
          })
          wx.hideLoading()
        }
      }
    })
  },
  shuru: function (e) {
    this.setData({
      stext: e.detail.value
    })
  },
  goopen: function (e) {
    //获取当前内容的标识id，保存，方便进入查询
    var id = e.currentTarget.id
    wx.setStorageSync('id', id)
    wx.navigateTo({
      url: '../detail/detail',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})