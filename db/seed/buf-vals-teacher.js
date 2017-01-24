'use strict'

var chance = require('chance')();
var debug = require('debug')('teacher');

module.exports = function(options) {
  debug('START teacher table');
  var buffersize = options !== undefined && options.buffersize !== undefined ? options.buffersize : 50;
  var buf = {};
  buf.column = ['first', 'last', 'abbr', 'pwd'];
  buf.values = new Array(buffersize);
  var bcrypt = require('bcrypt'); // for password hashing
  for (var i = 0; i < buffersize; i++) {
    var first = chance.first();
    var last = chance.last();
    var abbr = last.slice(0,3).toLowerCase() + i; // must be unique
    var pwd = chance.word();
    pwd = bcrypt.hashSync(pwd, 1);
    buf.values[i] = [first, last, abbr, pwd];
  }
  debug('END teacher table');
  return buf;
}
