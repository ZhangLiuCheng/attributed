function point(x, y) {
  this.x = x;
  this.y = y;
}

function rect(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;

  this.contains = function (x, y) {
    return this.x <= x && x <= this.x + this.width &&
      this.y <= y && y <= this.y + this.height;
  }
}

module.exports = {
  point: point,
  rect: rect
}