// pages/img/img.js

let shpae = require('../../utils/shape.js')
let picture = require('../../utils/picture.js')


Page({
  data: {
  },

  onLoad: function (options) {
    let that = this
    that.ctx = wx.createCanvasContext('myCanvas')
    wx.downloadFile({
      url: 'http://a4.topitme.com/o/201101/29/12962866459127.jpg',
      success: function (res) {
        let imgPath = res.tempFilePath
        that.imgPath = imgPath;
        wx.getImageInfo({
          src: imgPath,
          success: function (res) {
            let rect = new shpae.rect(10, 10, 200, 200);
            that.pic = new picture.Image(that, imgPath, rect);
            if (that.p2 == true) {
              that.interval = setInterval(that.drawImg, 30)
            }
            that.p1 = true
          }
        })
      },
      fail: function (res) {
        console.log('加载图片失败', res)
      }
    })

    wx.downloadFile({
      url: 'http://images.ali213.net/picfile/pic/2015/05/25/927_2015052520307658.jpg',
      success: function (res) {
        let imgPath = res.tempFilePath
        that.imgPath = imgPath;
        wx.getImageInfo({
          src: imgPath,
          success: function (res) {
            let rect1 = new shpae.rect(10, 300, 200, 200);
            that.pic1 = new picture.Image(that, imgPath, rect1);
            if (that.p1 == true) {
              that.interval = setInterval(that.drawImg, 30)
            }
            that.p2 = true
          }
        })
      }
    })
  },

  onUnload: function () {
    clearInterval(this.interval)
  },

  drawImg: function () {
    this.pic.draw(this.ctx);
    this.pic1.draw(this.ctx);
    this.ctx.draw();
  },

  touchstartCallback: function (e) {
    this.pic.touchstart(e);
    this.pic1.touchstart(e);
  },

  touchmoveCallback: function (e) {
    this.pic.touchmove(e);
    this.pic1.touchmove(e);
  },

  touchendCallback: function (e) {
    this.pic.touchend(e);
    this.pic1.touchend(e);
    if (this.moveTarget != undefined && this.changeTarget != undefined) {
      picture.changeImage(this.moveTarget, this.changeTarget);
    }
    this.moveTarget = undefined;
    this.changeTarget = undefined;
  }
})