'use strict'

var chance = require('chance')();
var debug = require('debug')('student_attends_course');
var pry = require('pryjs');

module.exports = function(options) {
  var courses = options.courses;
  var dims = options.dims;
  debug('START student_attends_course table');
  var buf = {};
  buf.column = ['student_id', 'course_id', 'exam1', 'exam2', 'kl', 'at'];
  buf.values = [];
  // eval(pry.it)
  for (var row of courses) {  // insert all students attending course with id === row.id
    var courseSize = chance.natural({min: 8, max: 20});
    var course_id = row.id;
    var participants = [];
    while (courseSize > 0) {
      var student_id = chance.natural({min: 1, max: dims.student.number});
      if (participants.indexOf(student_id) > -1) continue;
      participants.push(student_id);
      var exam1 = chance.natural({min: 0, max: 15});
      var exam2 = row.type === 'LK' ? chance.natural({min: 0, max: 15}) : null;
      var kl = row.type === 'LK' ? Math.round((exam1 + exam2) / 2) : exam1;
      var at = chance.natural({min: 0, max: 15});
      buf.values.push([student_id, course_id, exam1, exam2, kl, at]);
      courseSize--;
    }
  }
  debug('END student_attends_course table');
  return buf;
}
