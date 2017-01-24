'use strict'

// seed database
var chance = require('chance')();
var debug = require('debug')('seed');
var mysql = require('mysql');
var nconf = require('nconf');
var pry = require('pryjs');

nconf.argv().file({ file: nconf.get('reldir') + "config.json" });

const Connection = require('mysql/lib/Connection');
const Promise = require('bluebird');
Promise.promisifyAll([Connection]);

var connection = mysql.createConnection({
  host     : nconf.get('db:hostIp'),
  user     : nconf.get('db:user'),
  password : nconf.get('db:password'),
  database : nconf.get('db:database')
});

var teacherBufVals = require('./buf-vals-teacher');
var studentBufVals = require('./buf-vals-student');

var pConnect = connection.connectAsync();

var pDeleteStudent = pConnect.then((result) => {
  return connection.queryAsync('DELETE FROM student');
});
var pDeleteTeacher = pConnect.then((result) => {
  return connection.queryAsync('DELETE FROM teacher');
});

var pBufValsStudent = new Promise((resolve) => {
  resolve(studentBufVals(40));
});
var pBufValsTeacher = new Promise((resolve) => {
  resolve(teacherBufVals(10));
});

var pInsertStudent = Promise.all([pDeleteStudent, pBufValsStudent])
  .then((result) => {
    var buf = result[1];
    var column = buf.column.join(',');
    var preQuery = 'INSERT INTO student (' + column + ') VALUES ?';
    return connection.queryAsync(preQuery, [buf.values]);
  });
var pInsertTeacher = Promise.all([pDeleteTeacher, pBufValsTeacher])
  .then((result) => {
    var buf = result[1];
    var column = buf.column.join(',');
    var preQuery = 'INSERT INTO teacher (' + column + ') VALUES ?';
    return connection.queryAsync(preQuery, [buf.values]);
  });

Promise.all([pInsertStudent, pInsertTeacher]).then((result) => {
  return connection.endAsync();
})
  .then((result) => {
    debug("connection closed");
  });
