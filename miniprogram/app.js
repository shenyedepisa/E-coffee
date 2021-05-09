//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'longyue-1gtb81jtee5f29da',
        traceUser: true,
      })
    }
    this.globalData = {}
  },

  getOpenid: function () {
    var app = this;
    var openidStor = wx.getStorageSync('openid');
    if (openidStor) {
      console.log('本地获取openid:' + openidStor);
      app.globalData.openid = openidStor;
      app._getMyUserInfo();
    } else {
      wx.cloud.callFunction({
        name: 'getOpenid',
        success(res) {
          console.log('云函数获取openid成功', res.result.openid)
          var openid = res.result.openid;
          wx.setStorageSync('openid', openid)
          app.globalData.openid = openid;
          app._getMyUserInfo();
        },
        fail(res) {
          console.log('云函数获取失败', res)
        }
      })
    }
  },

  _getMyUserInfo() {
    let app = this
    var userStor = wx.getStorageSync('user');
    if (userStor) {
      console.log('本地获取user', userStor)
      app.globalData.userInfo = userStor;
    }
    wx.request({
      url: app.globalData.baseUrl + '/user/getUserInfo',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        console.log("Java后台返回的用户信息", res.data)
        if (res && res.data && res.data.data) {
          app.globalData.userInfo.nickName = res.data.data.username;
          app.globalData.userInfo.realphone = res.data.data.phone;
          console.log("===app.globalData===", app.globalData.userInfo)
          //缓存到本地
          wx.setStorageSync('user', app.globalData.userInfo)
        }
      }
    })
  },
})
