const app = getApp()
Page({
  data: {
    isShowUserName: false,
  },
  getUserProfile() {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '请授权登录Ecoffee',
      success: (res) => {
        //console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          isShowUserName: true,
          userInfo: user,
        })
        //console.log("userInfo",user);
        user.openid = app.globalData.openid;
        app._saveUserInfo(user);
      },
      fail: res => {
        //console.log("获取用户信息失败", res)
        wx.switchTab({
          url: '../home/home',
        })
      }
    })
  },
  goToFood() {
    let that = this;
    let temp2 = wx.getStorageSync('user');
    //if(!app.globalData.address)
    // {
    wx.showActionSheet({
      itemList: ["堂食", "外带"],
      success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex === 0) {
          app.globalData.address = "堂食";
        } else if (res.tapIndex === 1) {
          app.globalData.address = "外带";
        }
        if (!temp2) {
          that.getUserProfile();
        }
        wx.navigateTo({
          url: that.jump()
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
    // }
  },
  jump() {
    return '/pages/diancan/diancan'
  },
})