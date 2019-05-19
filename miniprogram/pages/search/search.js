// pages/search/search.js
Page({
  data: {
    tarray: [],
    stext: '',
    bol: false,
  },
  search: function () {
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
      //使用正则查询，实现对搜索的模糊查询
      text: db.RegExp({
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
  },
  content: function (e) {
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
})