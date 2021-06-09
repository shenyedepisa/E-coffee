import * as echarts from '../../components/ec-canvas/echarts.js'
let chart = null;
var option = {
  color: ['#37a2da', '#32c5e9', '#67e0e3'],
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    },
    confine: true
  },
  // legend: {
  //   data: ['总销量']
  // },
  grid: {
    left: 10,
    right: 30,
    bottom: 15,
    top: 5,
    containLabel: true
  },
  xAxis: [{
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#999'
      }
    },
    axisLabel: {
      color: '#666'
    }
  }],
  yAxis: [{
    type: 'category',
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: '#999'
      }
    },
    axisLabel: {
      color: '#666'
    }
  }],
  series: [{
    name: '总销量',
    type: 'bar',
    label: {
      normal: {
        show: true,
        position: 'inside'
      }
    },
    itemStyle: {}
  }]
};

//图表
function initChart(canvas, width, height) {
  // console.log(canvas)
  // console.log(height)
  // console.log(width)
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  //  数据库
  const db = wx.cloud.database({});
  wx.cloud.callFunction({
    name: "getFoodList",
    data: {
      action: 'charts'
    }
  }).then(res => {
    let dataList = res.result.data;
    // console.log("菜品数据", res.result.data); 
    const name = [];
    const sell = [];
    for (var i = 0; i < dataList.length; i++) {
      name.push(dataList[i].name);
      sell.push(dataList[i].sell);
    }
    console.log(name)
    option.yAxis[0].data = name;
    option.series[0].data = sell;
    /////////////////////////////////////////////
    chart.setOption(option);
    return chart;
  }).catch(res => {
    console.log("菜品数据请求失败", res)
  })
}

//不能省略
Page({
  data: {
    navbar: ["销量前十", "销量统计"],
    ec: {
      onInit: initChart
    },
    currentTab: 0,
    list: []
  },

  //切换顶部栏
  navbarTap: function (e) {
    wx.showLoading({
      title: 'Loading',
      mask: 'true'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 700)
    let index = e.currentTarget.dataset.idx;
    console.log("VM13:2 MiniProgramError U.createEvent is not a function... \r\n该报错应该是由于真机调试功能不支持Canvas 2d组件. \r\n我们在预览和发布后的测试中此页面的显示是正常的. \r\n断开真机调试即可看到正常页面. \r\n相关问题:https://developers.weixin.qq.com/community/develop/doc/0006e6b6e9cd60a681b9ea31b51000?_at=1585298814818");
    this.setData({
      currentTab: index
    })
    if (index == 0) {
      this.getHotGood();
    }
  },
  //获取热门推荐
  getHotGood() {
    wx.cloud.callFunction({
      name: "getFoodList",
      data: {
        action: "getHot"
      }
    }).then(res => {
      // console.log("热门Food数据", res.result)
      this.setData({
        goodList: res.result.data,
      })
    }).catch(res => {
      console.log("Food数据请求失败", res)
    })
  },
  //热门
  onShow() {
    this.getHotGood() //获取热门菜品
    let that = this;
    setInterval(() => {
      that.getHotGood()
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
    if (this.data.currentTab == 0) {
      this.onRefresh();
    } else {
      wx.stopPullDownRefresh();
    }
  }
})