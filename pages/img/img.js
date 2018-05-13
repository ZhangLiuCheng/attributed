// pages/img/img.js

let shpae = require('../../utils/shape.js')

function Picture(parent, imgPath, shapeRect) {
  this.parent = parent;
  this.imgPath = imgPath;
  this.shapeRect = shapeRect;
  this.offsetX = 0;
  this.offsetY = 0;
  this.scale = 1;
  this.float = false;
  this.canMove = false;
  this.canScale = false;
  this.canChange = false;

  this.draw = function (ctx) {
    // console.log(x, y, scaleWidth, scaleHeight)
    // console.log(this.offsetX, this.offsetY, this.scale)
    if (this.float) {
      ctx.save()
      ctx.setGlobalAlpha(0.5)
      ctx.beginPath()
      let floatW = this.shapeRect.width / 2;
      let floatH = this.shapeRect.height / 2;
      let x = this.shapeRect.x + this.offsetX + floatW / 2;
      let y = this.shapeRect.y + this.offsetY + floatH / 2;
      ctx.drawImage(this.imgPath, x, y, floatW, floatH);
      ctx.restore();
    } else {
      ctx.save()
      ctx.beginPath()
      ctx.rect(this.shapeRect.x, this.shapeRect.y, this.shapeRect.width, this.shapeRect.height)
      ctx.closePath();
      ctx.clip();

      // console.log(this.name, this.offsetY)
      let scaleWidth = this.shapeRect.width * this.scale;
      let scaleHeight = this.shapeRect.height * this.scale;
      let x = this.shapeRect.x + this.offsetX + (this.shapeRect.width - scaleWidth) / 2;
      let y = this.shapeRect.y + this.offsetY + (this.shapeRect.height - scaleHeight) / 2;
      ctx.drawImage(this.imgPath, x, y, scaleWidth, scaleHeight);

      if (this.canChange) {
        ctx.rect(this.shapeRect.x, this.shapeRect.y, this.shapeRect.width, this.shapeRect.height)
        ctx.setStrokeStyle('#3C8DEF')
        ctx.setLineWidth(5)
        ctx.stroke()
      }

      ctx.restore();
    }
  }

  this.touchstart = function (e) {
    if (e.touches.length == 1) {
      if (this.shapeRect.contains(e.touches[0].x, e.touches[0].y)) {
        this.canMove = true;
        this.parent.moveTarget = this;
        this.touchX = e.touches[0].x
        this.touchY = e.touches[0].y
        this.originX = this.offsetX
        this.originY = this.offsetY
      }
    } else if (e.touches.length == 2) {
      if (this.shapeRect.contains(e.touches[1].x, e.touches[1].y)) {
        this.canScale = true;

        let xMove = e.touches[1].x - e.touches[0].x;
        let yMove = e.touches[1].y - e.touches[0].y;
        let distance = Math.sqrt(xMove * xMove + yMove * yMove);
        // console.log('双手指触发开始 ---', xMove, yMove)
        // console.log('双手指触发开始 ===', distance, e)
        this.distance = distance
      }
    }
  }

  this.touchmove = function (e) {
    if (e.touches.length == 1) {
      if (this.canMove == true) {
        let newX = (e.touches[0].x - this.touchX) + this.originX
        let newY = (e.touches[0].y - this.touchY) + this.originY
        this.offsetX = newX
        this.offsetY = newY
        if (false == this.shapeRect.contains(e.touches[0].x, e.touches[0].y)) {
          this.float = true;
        }
      }
      if (this != this.parent.moveTarget && this.shapeRect.contains(e.touches[0].x, e.touches[0].y)) {
        this.canChange = true;
        this.parent.changeTarget = this;
      }

    } else if (e.touches.length == 2 && this.canScale == true) {
      let xMove = e.touches[1].x - e.touches[0].x;
      let yMove = e.touches[1].y - e.touches[0].y;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      let distanceDiff = distance - this.distance;
      let newScale = this.scale + 0.005 * distanceDiff
      if (newScale >= 3) {
        newScale = 3
      }
      if (newScale <= 1) {
        newScale = 1
      }
      this.distance = distance
      this.scale = newScale
      console.log(newScale)
    }
  }

  this.touchend = function (e) {
    if (this.canMove == true && this.parent.changeTarget != undefined) {
      this.offsetX = 0;
      this.offsetY = 0;
    }
    this.float = false;
    this.canMove = false;
    this.canScale = false;
    this.canChange = false;
  }
}

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
            that.pic = new Picture(that, imgPath, rect);
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
            that.pic1 = new Picture(that, imgPath, rect1);
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
    // console.log('=====touchendCallback=====', this.moveTarget.imgPath)

    // this.changeTarget.imgPath = 'http://a4.topitme.com/o/201101/29/12962866459127.jpg';
    // this.moveTarget.imgPath = 'http://a4.topitme.com/o/201101/29/12962866459127.jpg';
    // console.log('=====touchendCallback=====', this.moveTarget.imgPath)

    if (this.moveTarget != undefined && this.changeTarget != undefined) {
      let tmp = this.moveTarget.imgPath;
      // console.log('==========', this.moveTarget.imgPath, this.changeTarget.imgPath)

      this.moveTarget.imgPath = this.changeTarget.imgPath;
      this.changeTarget.imgPath = tmp;

      // console.log('==========', this.moveTarget.imgPath, this.changeTarget.imgPath)

    }
    this.moveTarget = undefined;
    this.changeTarget = undefined;
  }
})