global.Intl = require('intl');

module.exports = function() {
  this.toIndianFormat = function(string) {
    number = parseInt(string);
    return new Intl.NumberFormat('en-IN').format(number);
  }
};
