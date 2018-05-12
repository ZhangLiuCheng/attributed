//logs.js

Page({
  data: {
    canvasSize: 0,
    centerX: 0,
    centerY: 0,
    radius: 0
  },

  onLoad: function () {
    let width = wx.getSystemInfoSync().windowWidth
    this.setData({
      canvasSize: width,
      centerX: width / 2,
      centerY: width / 2,
      radius: width / 3.5
    })

    const ctx = wx.createCanvasContext('myCanvas')          
    this.drawBackground(ctx)          // 画背景色
    this.drawMi(ctx)                  // 画(米)字图案
    this.drawBorder(ctx)              // 画边框
    this.drawText(ctx)                // 画文字
    let property = [0.8, 0.95, 0.5, 0.3, 0.8, 0.1]
    this.drawProperty(ctx, property)  // 画属性 
    ctx.draw()
  },

  // 画背景色
  drawBackground: function (ctx) {
    ctx.beginPath()
    ctx.setGlobalAlpha(0.2)
    ctx.setFillStyle('#E1FDFF')

    let coords = this.coordinates(this.data.radius)
    for (let i = 0; i < coords.length; i++) {
      let X = coords[i].x
      let Y = coords[i].y
      if (i == 0) {
        ctx.moveTo(X, Y)
      } else {
        ctx.lineTo(X, Y)
      }
    }
    ctx.closePath()
    ctx.fill()
  },

  // 画(米)字图案
  drawMi: function (ctx) {
    ctx.beginPath()
    ctx.setLineWidth(0.8)
    ctx.setGlobalAlpha(1)
    ctx.setStrokeStyle('#93E4EC')

    let coords = this.coordinates(this.data.radius)
    for (let i = 0; i < coords.length; i++) {
      let X = coords[i].x
      let Y = coords[i].y
      ctx.moveTo(this.data.centerX, this.data.centerY)
      ctx.lineTo(X, Y)
    }
    ctx.stroke()
  },

  // 画边框
  drawBorder: function (ctx) {
    for (let i = 0; i < 4; i ++) {
      let coords = this.coordinates(this.data.radius * (4 - i) / 4)
      ctx.beginPath()
      ctx.setGlobalAlpha(1)
      ctx.setStrokeStyle('#93E4EC')
      ctx.setLineWidth(2.5 - i * 0.5)
      for (let i = 0; i < coords.length; i++) {
        let X = coords[i].x
        let Y = coords[i].y
        if (i == 0) {
          ctx.moveTo(X, Y)
        } else {
          ctx.lineTo(X, Y)
        }
      }
      ctx.closePath()
      ctx.stroke()
    }
  },

  // 画文字
  drawText: function (ctx) {
    let coords = this.coordinates(this.data.radius)
    ctx.beginPath()
    ctx.setFillStyle('#333333')
    ctx.setFontSize(18)

    ctx.setTextAlign('center')
    ctx.setTextBaseline('bottom')
    ctx.fillText('速度', coords[0].x, coords[0].y - 10)

    ctx.setTextAlign('left')
    ctx.fillText('判断力', coords[1].x + 10, coords[1].y)

    ctx.setTextAlign('left')
    ctx.setTextBaseline('top')
    ctx.fillText('计算力', coords[2].x + 10, coords[2].y)

    ctx.setTextAlign('center')
    ctx.fillText('精确度', coords[3].x, coords[3].y + 10)

    ctx.setTextAlign('right')
    ctx.setTextBaseline('top')
    ctx.fillText('观察力', coords[4].x - 10, coords[4].y)

    ctx.setTextAlign('right')
    ctx.setTextBaseline('bottom')
    ctx.fillText('记忆力', coords[5].x - 10, coords[1].y)
  },

  // 画 属性 
  drawProperty: function (ctx, property) {
    ctx.beginPath()
    ctx.setGlobalAlpha(0.2)
    ctx.setFillStyle('#EE0000')

    let coords = this.coordinatesByProperty(property)
    for (let i = 0; i < coords.length; i++) {
      let X = coords[i].x
      let Y = coords[i].y
      if (i == 0) {
        ctx.moveTo(X, Y)
      } else {
        ctx.lineTo(X, Y)
      }
    }
    ctx.closePath()
    ctx.fill()
  },

  // 获取对应的坐标系
  coordinates: function(radius) {
    let result = []
    for (let i = 0; i < 6; i++) {
      let radian = (2 * Math.PI / 360) * 60 * i;
      let X = this.data.centerX + Math.sin(radian) * radius
      let Y = this.data.centerY - Math.cos(radian) * radius
      var coord = {
        x: X,
        y: Y
      }
      result.push(coord)
    }
    return result
  },

  // 获取属性坐标点
  coordinatesByProperty: function (property) {
    let result = []
    for (let i = 0; i < 6; i++) {
      let radian = (2 * Math.PI / 360) * 60 * i;
      let radius = this.data.radius * property[i]
      let X = this.data.centerX + Math.sin(radian) * radius
      let Y = this.data.centerY - Math.cos(radian) * radius
      var coord = {
        x: X,
        y: Y
      }
      result.push(coord)
    }
    return result
  }
})
