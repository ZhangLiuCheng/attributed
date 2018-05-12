function person(name) {
  this.name = name
  this.print = print

  function print() {
    console.log(this.name)
  }
}

module.exports = {
  person: person,
}