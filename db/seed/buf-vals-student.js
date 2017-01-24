'use strict'

var chance = require('chance')();
var debug = require('debug')('student');

module.exports = function(options) {
  var buffersize = options !== undefined && options.buffersize !== undefined ? options.buffersize : 2000;
  debug('START student table');
  var buf = {};
  buf.column = ['first', 'last', 'dob', 'lane', 'heldback', 'entrance'];
  buf.values = new Array(buffersize);
  for (var i = 0; i < buffersize; i++) {
    var first = chance.first();
    var last = chance.last();
    var date = chance.date({
      string: true,
      year: chance.year({min: 1995, max: 2005})
    }).match(/\d+/g); // chance.date({string: true }) returns like "5/27/2078"
    var dob = date[2] + '-' + date[0] + '-' + date[1];
    var lane = chance.natural({min: 1, max: 4});
    var r = 3, k = 32;
    var heldback = Math.floor(Math.pow(Math.random(),k)*r);
    var entrance = 11 + parseInt(dob.match(/\d{4}/)[0]) + chance.natural({min: 0, max: 2});
    buf.values[i] = [first, last, dob, lane, heldback, entrance];
  }
  debug('END student table');
  return buf;
}
