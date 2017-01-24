'use strict'

var chance = require('chance')();
var debug = require('debug')('course');
var subject = require('./data-subject');
var typeExtend = require('./data-type-extend');
var pry = require('pryjs')

module.exports = function(options) {
  debug('START student table');
  var buffersize = options !== undefined && options.buffersize !== undefined ? options.buffersize : 500;
  var maxterm = options !== undefined && options.maxterm !== undefined ? options.maxterm : 500;
  var buf = {};
  buf.column = ['subject_abbr', 'term', 'type', 'extend'];
  buf.values = new Array(buffersize);
  for (var i = 0; i < buffersize; i++) {
    var subject_abbr = subject[chance.natural({min: 0, max: subject.length-1})][0];
    var term = chance.natural({min: 1, max: maxterm});
    var keys = Object.keys(typeExtend);
    var type = keys[chance.natural({min: 0, max: keys.length-1})];
    var extend = '{ "extend": [' + typeExtend[type] + '] }';
    buf.values[i] = [subject_abbr, term, type, extend];
  }
  debug('END student table');
  return buf;
}
