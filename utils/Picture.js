
function Image(parent, imgPath, shapeRect) {
  this.parent = parent;
  this.imgPath = imgPath;
  this.shapeRect = shapeRect;
  this.offsetX = 0;
  this.offsetY = 0;
  this.scale = 1.2;
  this.float = false;
  this.canMove = false;
  this.canScale = false;
  this.canChange = false;

  this.reset = function () {
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1.2;
    this.float = false;
    this.canMove = false;
    this.canScale = false;
    this.canChange = false;
  }

  this.draw = function (ctx) {
    if (this.float) {
      ctx.save()
      ctx.setGlobalAlpha(0.5)
      ctx.beginPath()

      let x = this.touchX - this.shapeRect.width / 3;
      let y = this.touchY - this.shapeRect.height / 3;
      ctx.drawImage(this.imgPath, x, y, this.shapeRect.width / 1.5, this.shapeRect.height / 1.5);
      ctx.restore();
    } else {
      ctx.save()
      ctx.beginPath()
      ctx.rect(this.shapeRect.x, this.shapeRect.y, this.shapeRect.width, this.shapeRect.height)
      ctx.closePath();
      ctx.clip();
      let scaleWidth = this.shapeRect.width * this.scale;
      let scaleHeight = this.shapeRect.height * this.scale;
      let x = this.shapeRect.x + this.offsetX + (this.shapeRect.width - scaleWidth) / 2;
      let y = this.shapeRect.y + this.offsetY + (this.shapeRect.height - scaleHeight) / 2;
      // console.log(x, y, scaleWidth, scaleHeight)
      // console.log(this.offsetX, this.offsetY)
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
        this.distance = distance
      }
    }
  }

  this.touchmove = function (e) {
    if (e.touches.length == 1) {
      if (this.canMove == true) {
        let newX = (e.touches[0].x - this.touchX) + this.originX;
        let newY = (e.touches[0].y - this.touchY) + this.originY;
        this.offsetX = newX;
        this.offsetY = newY;
        if (false == this.shapeRect.contains(e.touches[0].x, e.touches[0].y)) {
          this.float = true;
          this.touchX = e.touches[0].x
          this.touchY = e.touches[0].y
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
      let newScale;
      if (distanceDiff >= 0) {
        newScale = this.scale + 0.008 * distanceDiff;
      } else {
        newScale = this.scale + 0.03 * distanceDiff;
      }
      if (newScale >= 6) {
        newScale = 6;
      }
      if (newScale <= 1) {
        newScale = 1;
      }
      this.distance = distance;
      this.scale = newScale;
    }
  }

  this.touchend = function (e) {
    // if (this.canMove == true && this.parent.changeTarget != undefined) {
    //   this.offsetX = 0;
    //   this.offsetY = 0;
    // }
    let x = (this.shapeRect.width * this.scale - this.shapeRect.width) / 2;
    let y = (this.shapeRect.height * this.scale - this.shapeRect.height) / 2;
    if (this.offsetX > x) {
      this.offsetX = x;
    }
    if (this.offsetY > y) {
      this.offsetY = y;
    }
    if (this.offsetX < -x) {
      this.offsetX = -x;
    }
    if (this.offsetY < -y) {
      this.offsetY = -y;
    }
    this.float = false;
    this.canMove = false;
    this.canScale = false;
    this.canChange = false;
  }
}

function changeImage(src, dest) {
  let tmp = src.imgPath;
  src.imgPath = dest.imgPath;
  dest.imgPath = tmp;
  src.reset();
}

module.exports = {
  Image: Image,
  changeImage: changeImage
}