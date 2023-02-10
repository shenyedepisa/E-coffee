let app = getApp();
let curNum = -1;
const stringdata = "num"
const db = wx.cloud.database()
Page({
  data: { //页面的初始数据   
    address: app.globalData.address,
    flag: 0,
    cartList: [], // 购物车数据
    totalPrice: 0, //总价
    totalNum: 0, //总数量
    radioItem: [{
        value: '堂食',
        checked: ''
      },
      {
        value: '外带',
        checked: ''
      },
    ]
  },
  onLoad() {
    //购物车的数据
    var arr = wx.getStorageSync('cart') || [];
    for (var i in arr) {
      this.data.totalPrice += arr[i].quantity * arr[i].price;
      this.data.totalNum += arr[i].quantity
    }
    this.setData({
      cartList: arr,
      totalPrice: this.data.totalPrice.toFixed(2),
      totalNum: this.data.totalNum
    })

    if (app.globalData.address == "堂食") {
      this.setData({
        radioItem: [{
            value: '堂食',
            checked: 'true'
          },
          {
            value: '外带',
            checked: ''
          },
        ]
      })
    } else {
      this.setData({
        radioItem: [{
            value: '堂食',
            checked: ''
          },
          {
            value: '外带',
            checked: 'true'
          },
        ]
      })
    }
  },

  //提交订单
  submitOrder: function (e) {
    let that = this;
    wx.showLoading({
      title: '支付中...',
      mask: true
    })
    wx.requestSubscribeMessage({
      tmplIds: ['S4UGsNlEH8QsVRlMiDo4WTKqiKC65C-1Rtts2vgGd1I'],
      success(res) {
        console.log("消息模板", res);
        let arrNew = [];
        //console.log("flag"+this.data.flag);
        //读取当前数据库中编号值
        arrNew = that.callArr();
        setTimeout(() => {
          if (that.data.flag == 0) {
            setTimeout(function () {
              wx.hideLoading()
            }, 1500)
            db.collection("order")
              .count()
              .then(res => {
                console.log("查看", res);
                db.collection("order").add({
                  data: {
                    NO: res.total,
                    name: app.globalData.userInfo.nickName,
                    address: app.globalData.address,
                    totalPrice: that.data.totalPrice, //总价钱
                    orderList: arrNew, //存json字符串
                    status: 0, //-1订单取消,0新下单待上餐,1待用户评价,2订单已完成
                    _createTime: new Date().getTime() //创建的时间
                  }
                }).then(res => {
                  //console.log("支付成功", res)
                  wx.showToast({
                    title: '下单成功！',
                    duration: 1000,
                    mask: true
                  })
                  //把购买的菜品销量增加 
                  wx.cloud.callFunction({
                    name: "addXiaoLiang",
                    data: {
                      id: res._id
                    }
                  }).then(res => {
                    wx.setStorageSync('cart', "")
                    wx.switchTab({
                      url: '../myOrder/myOrder',
                    })
                  }).catch(res => {
                    //console.log('添加销量失败', res)
                    wx.showToast({
                      icon: 'none',
                      title: '支付失败',
                      mask: true,
                    })
                  })

                }).catch(res => {
                  wx.showToast({
                    icon: 'none',
                    title: '支付失败',
                    mask: true,
                  })
                  //console.log("支付失败", res)
                })
              })
          }
        }, 1600);
      },
      fail(res) {
        console.log(res);
        setTimeout(function () {
          wx.hideLoading()
        }, 1500)
        let arrNew = [];
        //console.log("flag"+this.data.flag);
        //读取当前数据库中编号值
        arrNew = that.callArr();
        setTimeout(() => {
          if (that.data.flag == 0) {
            db.collection("order")
              .count()
              .then(res => {
                db.collection("order").add({
                  data: {
                    NO: res.total,
                    name: app.globalData.userInfo.nickName,
                    address: app.globalData.address,
                    totalPrice: that.data.totalPrice, //总价钱
                    orderList: arrNew, //存json字符串
                    status: 0, //-1订单取消,0新下单待上餐,1待用户评价,2订单已完成
                    _createTime: new Date().getTime() //创建的时间
                  }
                }).then(res => {
                  //console.log("支付成功", res)
                  wx.showToast({
                    title: '下单成功！',
                    duration: 1000,
                    mask: true
                  })
                  //把购买的菜品销量增加 
                  wx.cloud.callFunction({
                    name: "addXiaoLiang",
                    data: {
                      id: res._id
                    }
                  }).then(res => {
                    wx.setStorageSync('cart', "")
                    wx.switchTab({
                      url: '../myOrder/myOrder',
                    })
                  }).catch(res => {
                    //console.log('添加销量失败', res)
                    wx.showToast({
                      mask: true,
                      icon: 'none',
                      title: '支付失败',
                    })
                  })

                }).catch(res => {
                  wx.showToast({
                    mask: true,
                    icon: 'none',
                    title: '支付失败',
                  })
                  //console.log("支付失败", res)
                })
              })
          }
        }, 1600);
      }
    })

  },

  callArr() {
    let arrNew = [];
    let arr = wx.getStorageSync('cart') || [];
    arr.forEach(item => {
      wx.cloud.callFunction({
        name: "getFoodList",
        data: {
          action: "search",
          searchKey: item.name,
        }
      }).then(res => {
        let status = res.result.data[0].status;
        //console.log(status);
        if (status == "下架") {
          if (this.data.flag == 0) {
            this.setData({
              flag: 1
            })
            wx.showToast({
              mask: true,
              icon: 'none',
              title: "抱歉(*>﹏<*)\r\n订单中有商品刚刚售罄了, 请重新提交订单\r\n",
              duration: 1500,
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              })
            }, 1500);
          }
        }
      })

      arrNew.push({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })
    });
    return arrNew;
  },

  tapRadio(e) {
    //console.log(e.detail.value);
    app.globalData.address = e.detail.value;
    this.setData({
      address: app.globalData.address
    })
  }
})