module.exports = function() {
  this.toIndianFormat = function(string) {
    return parseInt(string).toLocaleString('en-IN');
  }
};
