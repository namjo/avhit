'use strict'

var chance = require('chance')();
var debug = require('debug')('subject');
var subject = require('./data-subject');

module.exports = function(options) {
  debug('START subject table');
  var buf = {};
  buf.column = ['abbr', 'title'];
  buf.values = subject;
  debug('END subject table');
  return buf;
}
