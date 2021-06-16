var app = getApp()
let intervalID = 0;
let orderStatus = 0; //-1订单取消,0待制作,1待取餐 2已完成
let db = wx.cloud.database();
Page({
  data: {
    // 顶部菜单切换
    navbar: ["待制作", "待取餐", "已完成", "已取消"],
    // 默认选中菜单
    list: [],
    currentTab: 0,
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
    } else if (index == 3) {
      orderStatus = -1;
    } else {
      orderStatus = 0;
    }
    this.getMyOrderList();
  },

  onShow: function () {
    this.getMyOrderList();
    //console.log("nooooo:  "+orderStatus)
    let that = this;
    intervalID = setInterval(() => {
      that.getMyOrderList();
    }, 3000);
  },
  onUnload: function () {
    clearInterval(intervalID);
  },

  //加菜
  addOrder() {
    wx.navigateTo({
      url: '/pages/diancan/diancan'
    })
  },

  getMyOrderList() {
    let openid = app._checkOpenid();
    //console.log('openid',openid);
    if (!openid) {
      this.setData({
        list: []
      })
      return;
    }
    let tempUser = wx.getStorageSync('user');
    if (!tempUser) {
      this.setData({
        list: []
      })
      return;
    }
    wx.cloud.callFunction({
        name: 'getOrderList',
        data: {
          action: 'user',
          orderStatus: orderStatus
        }
      })
      .then(res => {
        //console.log("订单列表获取成功", res)
        this.setData({
          list: res.result.data
        })
      }).catch(res => {
        //console.log("订单列表获取失败", res)
      })
  },

  //取消订单
  cancleOrder(event) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '订单即将开始制作...\r\n确定要取消订单吗',
      success(res) {
        if (res.confirm) {
          let orderId = event.currentTarget.dataset.orderid;
          //console.log("orderID"+orderId)
          db.collection('order').doc(orderId).update({
            data: {
              status: -1
            }
          }).then(res => {
            wx.showToast({
              mask: true,
              icon: "none",
              title: '订单已取消',
            })
            that.getMyOrderList();
            //console.log('取消订单成功', res)
          }).catch(res => {
            //console.log('取消订单失败', res)
          })
          return;
        } else if (res.cancel) {
          return;
        }
      }
    })

  },
  //刷新
  onRefresh() {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      mask: true,
      title: '刷新中...',
    })
    this.onShow();
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