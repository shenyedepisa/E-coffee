var app = getApp()
let orderStatus = 0; //0新下单待制作，1订单已完成，2待评价
let db = wx.cloud.database();

Page({
  data: {
    // 顶部菜单切换
    navbar: ["待取餐", "已完成"],
    // 默认选中菜单
    currentTab: 0,
    list: []
  },
  //顶部tab切换
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })
    if (index == 0) {
      orderStatus = 1;
    } else if (index == 1) {
      orderStatus = 2;
    }  else {
      orderStatus = 1;
    }
    this.getMyOrderList();
  },

  onShow: function () {
    orderStatus = 1;
    this.getMyOrderList();
    let that = this;
    setInterval(()=>{
      that.getMyOrderList();
    },3000);
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
          action:'admin',
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
  shangcaiwancheng(e) {
    //console.log(e.currentTarget.dataset.id)
    wx.cloud.callFunction({
      name: 'waiter_already',
      data: {
        id: e.currentTarget.dataset.id
      }
    }).then(res => {
      //console.log('上菜成功', res)
     // console.log("here is!",res.result,res.result.stats,res.result.stats.updated);
      if (res.result && res.result.stats && res.result.stats.updated > 0) {
        wx.showToast({
          title: '修改成功',
          duration: 800,
        })
        this.getMyOrderList()
      } else {
        //console.log("wait!!!!"),
        wx.showToast({
          mask:true,
          icon: 'none',
          title: '提交失败',
        })
      }
    }).catch(res => {
      //console.log('上菜成功no', res)
      wx.showToast({
        mask:true,
        icon: 'none',
        title: '提交失败',
      })
    })
  },
  
  onUnload() {
    let pages = getCurrentPages();
    let n = pages.length - 1;
    if(n>1){
      wx.navigateBack({
        delta: n
      })
    }
  },
    //刷新
    onRefresh(){
      //在当前页面显示导航条加载动画
      wx.showNavigationBarLoading(); 
      //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
      wx.showLoading({
        mask:true,
        title: '刷新中...',
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