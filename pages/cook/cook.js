var app = getApp()
let orderStatus = 0; //0新下单待制作，1订单已完成，2待评价
let db = wx.cloud.database();

Page({
  data: {
    // 顶部菜单切换
    navbar: ["待制作", "已完成"],
    // 默认选中菜单
    currentTab: 0,
    list: []
  },
  //顶部tab切换
  navbarTap: function (e) {
    wx.showLoading({
      title: 'Loading',
      mask: 'true'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 700)
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })
    if (index == 0) {
      orderStatus = 0;
    } else if (index == 1) {
      orderStatus = 1;
    } else if (index == 2) {
      orderStatus = 2;
    } else {
      orderStatus = 0;
    }
    //console.log(orderStatus)
    this.getMyOrderList();

  },

  onShow: function () {
    orderStatus = 0
    this.getMyOrderList();
    let that = this;
    setInterval(() => {
      that.getMyOrderList();
    }, 3000);
  },

  getMyOrderList() {
    let openid = app._checkOpenid();
    if (!openid) {
      return;
    }
    //请求自己后台获取用户openid
    wx.cloud.callFunction({
        name: 'getOrderList',
        data: {
          action: 'admin',
          orderStatus: orderStatus
        }
      })
      .then(res => {
        //console.log("用户订单列表", res)
        this.setData({
          list: res.result.data
        })
      }).catch(res => {
        //console.log("用户订单列表失败", res)
      })
  },
  //制作完成
  zhizuowancheng(e) {
    console.log(e)
    let No;
    let id = e.currentTarget.dataset.id;
    let time = e.currentTarget.dataset.time;
    let openid;
    wx.cloud.callFunction({
      name: 'houchu',
      data: {
        id: e.currentTarget.dataset.id
      }
    }).then(res => {
      console.log('制作完成', res)
      if (res.result && res.result.stats && res.result.stats.updated > 0) {
        wx.showToast({
          title: '修改成功',
          duration: 800,
        })
        this.getMyOrderList()
      } else {
        wx.showToast({
          mask: true,
          icon: 'none',
          title: '提交失败',
        })
      }
    }).catch(res => {
      //console.log('制作完成no', res)
      wx.showToast({
        mask: true,
        icon: 'none',
        title: '提交失败',
      })
    })
    let re = db.collection('order').where({
      _id: id
    }).get().then((d) => {
      //请求成功后
      console.log(d);
      No = d.data[0].NO;
      openid = d.data[0]._openid;
      console.log(time)
      wx.cloud.callFunction({
        name: 'sendNew',
        data: {
          openid: openid,
          time: time,
          No: No
        }
      }).then(res => {
        console.log("成功", res)
      }).catch(res => {
        console.log("失败", res)
      })
    })
  },

  onUnload() {
    let pages = getCurrentPages();
    let n = pages.length - 1;
    if (n > 1) {
      wx.navigateBack({
        delta: n
      })
    }
  },
  //刷新
  onRefresh() {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
      mask: true,
    })
    this.getMyOrderList();
    //网络请求执行完后将执行的动作
    setTimeout(() => {
      //隐藏loading 提示框
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000);

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //调用刷新时将执行的方法
    this.onRefresh();
  }
})