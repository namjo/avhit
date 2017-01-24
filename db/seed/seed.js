'use strict'

console.time('seed')

// seed database
var chance = require('chance')();
var debug = require('debug')('seed');
var mysql = require('mysql');
var nconf = require('nconf');
var pry = require('pryjs');

nconf.argv().file({ file: nconf.get('reldir') + "config.json" });
const dims = nconf.get('dims');

const Connection = require('mysql/lib/Connection');
const Promise = require('bluebird');
Promise.promisifyAll([Connection]);

var connection = mysql.createConnection({
  host     : nconf.get('db:hostIp'),
  user     : nconf.get('db:user'),
  password : nconf.get('db:password'),
  database : nconf.get('db:database')
});

// define promise delete table
var pDelete = function(table) {
  return pConnect.then((result) => {
    return connection.queryAsync('DELETE FROM ' + table);
  })
  .then((result) => {
    return connection.queryAsync('ALTER TABLE ' + table + ' AUTO_INCREMENT=1')
  })
  .catch((err) => {
    debug('Maybe there\'s nothing to AUTO_INCREMENT ...')
  });
}
// define promise buffered values
var pBufVals = function(table, options) {
  var bufVals = require('./buf-vals-' + table);
  return new Promise((resolve) => {
    resolve(bufVals(options));
  });
}
// define promise to delete and insert buffered values
var pDeleteAndInsert = function(table, options) {
  return Promise.all([
    pDelete(table),
    pBufVals(table, options)
  ])
  .then((result) => {
    var buf = result[1];
    var preQuery = 'INSERT INTO ' + table + ' (' + buf.column.join(',') + ') VALUES ?';
    return connection.queryAsync(preQuery, [buf.values]);
  });
}

// Ready. We're good to go! Open connection
var pConnect = connection.connectAsync();
// populate database. raw data
var pAllInsertRawData = [];
pAllInsertRawData.push(pDeleteAndInsert('student', {buffersize: dims.student.number}));
pAllInsertRawData.push(pDeleteAndInsert('teacher', {buffersize: dims.teacher.number}));
pAllInsertRawData.push(pDeleteAndInsert('subject'));
pAllInsertRawData.push(pDeleteAndInsert('course', {buffersize: dims.course.number, maxterm: dims.course.maxterm}));
// populate database with relationships after all raw data has been inserted
Promise.all(pAllInsertRawData)
.then((result) => {
  return connection.queryAsync('SELECT * FROM course');
})
.then((courses) => {
  return pDeleteAndInsert('student_attends_course', {courses: courses, dims: dims});
})
// close connection
.then((result) => {
  return connection.endAsync();
})
.then((result) => {
  debug('connection closed');
  console.timeEnd('seed')
});
