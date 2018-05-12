// pages/img/img.js

let shpae = require('../../utils/shape.js')

Page({

  data: {
    touch: {
      distance: 0,
      scale: 1,
      baseWidth: 200,
      baseHeight: 200,
      offsetX: 0,
      offsetY: 0
    }
  },

  onLoad: function (options) {
    

    // let r = new shpae.rect(10, 10, 100, 100)
    // let p = new shpae.point(1, 2)

    function picture(ctx, ) {

    }

    let that = this
    const ctx = wx.createCanvasContext('myCanvas')
    that.ctx = ctx;

    wx.downloadFile({
      url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1525929025543&di=7681af5614735060a95991aceb9937b6&imgtype=0&src=http%3A%2F%2Fstatic01.lvye.com%2Fforum%2F201403%2F03%2F165020lfcmellecd1hg55e.jpg',
      success: function (res) {
        let imgPath = res.tempFilePath
        that.imgPath = imgPath;
        wx.getImageInfo({
          src: imgPath,
          success: function (res) {
            // that.interval = setInterval('that.drawImg(ctx, imgPath)', 34)
            that.interval = setInterval(that.drawImg, 30)
            // that.drawImg(ctx, imgPath)
          }
        })
      }
    })
  },

  onUnload: function () {
    clearInterval(this.interval)
  },

  drawImg: function () {
    let ctx = this.ctx;
    // const ctx = wx.createCanvasContext('myCanvas')

    let imgPath = this.imgPath
    let that = this

    ctx.save()
    ctx.beginPath()

    // ctx.moveTo(0, 0)
    // ctx.lineTo(res.width / 3, 0)
    // ctx.lineTo(res.width / 3, res.height / 3)
    // ctx.arc(50, 50, 25, 0, 2 * Math.PI)

    ctx.rect(0, 0, that.data.touch.baseWidth, that.data.touch.baseHeight)
    ctx.closePath();
    ctx.clip()

    // ctx.translate(20, 20)
    // ctx.rotate(20 * Math.PI / 180)
    // ctx.drawImage(imgPath, 0, 0, that.data.touch.scaleWidth, that.data.touch.scaleHeight)
    let scaleWidth = that.data.touch.baseWidth * that.data.touch.scale
    let scaleHeight = that.data.touch.baseHeight * that.data.touch.scale

    ctx.drawImage(imgPath, 
      that.data.touch.offsetX + (that.data.touch.baseWidth - scaleWidth) / 2, 
      that.data.touch.offsetY + (that.data.touch.baseHeight - scaleHeight) / 2, 
      scaleWidth, 
      scaleHeight)

    ctx.restore()
    ctx.draw()

  },

  touchstartCallback: function (e) {
        // console.log('双手指触发开始', e, this.data.touch)
    if (e.touches.length == 1) {
      this.touchX = e.touches[0].x
      this.touchY = e.touches[0].y
      this.originX = this.data.touch.offsetX
      this.originY = this.data.touch.offsetY
      return
    } 

    let xMove = e.touches[1].x - e.touches[0].x;
    let yMove = e.touches[1].y - e.touches[0].y;
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    // console.log('双手指触发开始 ---', xMove, yMove)
    // console.log('双手指触发开始 ===', distance, e)

    this.data.touch.distance = distance

  },

  touchmoveCallback: function (e) {
    let touch = this.data.touch
    if (e.touches.length == 1) {
      let newX = (e.touches[0].x - this.touchX) + this.originX
      let newY = (e.touches[0].y - this.touchY) + this.originY
      this.data.touch.offsetX = newX
      this.data.touch.offsetY = newY
      return
    }
    // console.log('双手指运动')
    let xMove = e.touches[1].x - e.touches[0].x;
    let yMove = e.touches[1].y - e.touches[0].y;
    // 新的 ditance
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    let distanceDiff = distance - touch.distance;
    let newScale = touch.scale + 0.005 * distanceDiff
    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
    if (newScale >= 3) {
      newScale = 3
    }
    if (newScale <= 1) {
      newScale = 1
    }
    let scaleWidth = newScale * touch.baseWidth
    let scaleHeight = newScale * touch.baseHeight
    // 赋值 新的 => 旧的
    this.data.touch.distance = distance
    this.data.touch.scale = newScale

    // console.log(this.data.touch)
  },


})