//index.js
//获取应用实例
const app = getApp()

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  print() {
    console.log(this.x + ' ====  ' + this.y)
  }

  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.hypot(dx, dy);
  }
}

function person(name) {
  this.name = name
  this.print = print

  function print() {
    console.log(this.name)
  }
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  bindViewTap1: function () {
    wx.navigateTo({
      url: '../img/img'
    })
  },

  onLoad: function () {

    
    const p1 = new Point(5, 5);
    const p2 = new Point(10, 10);
    p1.print()
    console.log(Point.distance(p1, p2));

    

    let pp1 = new person('zhangsan')
    pp1.print()
    let pp2 = new person('lisi')
    pp2.print()
    pp1.print()

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
