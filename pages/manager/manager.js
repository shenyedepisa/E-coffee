let a = "";
// pages/manager/manager.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbar: ["上架列表", "下架列表", "更多设置"],
    currentTab: 0,
    // onSaleList:[],
    // offShelfList:[],
    foodList: [],
  },
  navbarTap(e) {
    let index = e.currentTarget.dataset.idx;
    if (index != this.data.currentTab && index != 2) {
      wx.showLoading({
        title: 'Loading',
        mask: 'true'
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 700)
    }
    if (index == 1 || index == 0) {
      this.getList(index);
    }
    this.setData({
      currentTab: index
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let pages = getCurrentPages();
    let n = pages.length - 1;
    if (n > 1) {
      wx.navigateBack({
        delta: n
      })
    }
  },

  //上架下架
  changeStatus(e) {
    let action;
    if (this.data.currentTab == 1) {
      action = "onSale"
    } else {
      action = "offShelf"
    }
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name: 'changeStatus',
      data: {
        action: action,
        id: id
      }
    }).then(res => {
      // console.log('提交', res)
      if (res.result && res.result.stats && res.result.stats.updated > 0) {
        if (action == "onSale") {
          wx.showToast({
            title: '上架成功',
            duration: 800,
          })
        } else {
          wx.showToast({
            title: '下架成功',
            duration: 800,
          })
        }
        this.getList(this.data.currentTab)
      } else {}
    }).catch(res => {
      // console.log('制作完成no', res)
      wx.showToast({
        mask: true,
        icon: 'none',
        title: '提交数据异常',
      })
    })
  },

  getList(n) {
    let temp;
    if (n == 0) {
      temp = "onSale"
    } else {
      temp = "offShelf"
    }
    console.log(temp);
    wx.cloud.callFunction({
      name: "getFoodList",
      data: {
        action: temp
      }
    }).then(res => {
      this.setData({
        foodList: res.result.data,
      })
    }).catch(res => {
      console.log("Food数据请求失败", res)
    })
  },

  copy() {
    wx.setClipboardData({
      data: "https://longyue-1gtb81jtee5f29da-1305814139.tcloudbaseapp.com/wx-cms/#/project/home",
      success: function () {
        console.log('复制成功');
      },
      fail: function () {
        console.log('复制失败');
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(this.data.currentTab);
    let that = this;
    setInterval(() => {
      that.getList(that.data.currentTab);
    }, 3000);
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
    this.onLoad();
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
    if (this.data.currentTab != 2) {
      this.onRefresh();
    } else {
      wx.stopPullDownRefresh();
    }
  }
})