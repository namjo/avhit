'use strict'

// seed database
var Chance = require('chance');
var mysql = require('mysql');
var nconf = require('nconf');
var path = require('path');
var pry = require('pryjs');
var debug = require('debug')('seed_pipe');
var stream = require('stream');

var chance = new Chance();
nconf.argv().file({ file: nconf.get('root') + "config.json" })

var connection = mysql.createConnection({
  host     : nconf.get('db:hostIp'),
  user     : nconf.get('db:user'),
  password : nconf.get('db:password'),
  database : nconf.get('db:database')
});

// Remove this should it bring no optimization for the bulk inserts ... maybe use a pool ...
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  debug('connected as id ' + connection.threadId);
});

var idCount = 0;

var bufferedValues = function(n) {
  var values = new Array(n);
  for (var i = 0; i < n; i++) {
    var id = ++idCount;
    var first = chance.first();
    var last = chance.last();
    var dob = chance.year({min: 1995, max: 2005}) + '-' + chance.month({raw: true})['numeric'] + '-' + chance.natural({min: 1, max: 28});
    var lane = chance.natural({min: 1, max: 4});
    var r = 4, k = 2;
    var heldback = Math.ceil(Math.pow((chance.natural({min: 0, max: r})/r),k)*r);
    var entrance = 5 + parseInt(dob) + chance.natural({min: 0, max: 2});
    var value = [id, first, last, dob, lane, heldback, entrance];
    values[i] = value;
  }
  return values;
}

connection.query('DELETE FROM student', function(err, res) {
  if(err) throw err;
  // debug(i + ' Last insert ID: ', res.insertId, ' affected rows: ', res.affectedRows);
});

var bulkinsert = function(n) {
  var statement = 'INSERT INTO student(id, first, last, dob, lane, heldback, entrance) VALUES ?';
  var values = new Array(n);
  for (var i = 0; i < n; i++) {
    var id = ++idCount;
    var first = chance.first();
    var last = chance.last();
    var dob = chance.year({min: 1995, max: 2005}) + '-' + chance.month({raw: true})['numeric'] + '-' + chance.natural({min: 1, max: 28});
    var lane = chance.natural({min: 1, max: 4});
    var r = 4, k = 2;
    var heldback = Math.ceil(Math.pow((chance.natural({min: 0, max: r})/r),k)*r);
    var entrance = 5 + parseInt(dob) + chance.natural({min: 0, max: 2});
    var value = [id, first, last, dob, lane, heldback, entrance];
    values[i] = value;
  }
  // debug(values);
  connection.query(statement, [values], function(err, res) {
    if(err) throw err;
    // debug(i + ' Last insert ID: ', res.insertId, ' affected rows: ', res.affectedRows);
  });
}

// --- PROMISE BEGIN

console.time('inserting');

// still only one connection!
function promiseBuffer(n) {
  return new Promise((resolve, reject) => {
    resolve(bufferedValues(n));
    debug('values promised to be buffered');
  });
}

var t = 10;
var b = 10000;

var promiseBuffers = new Array(t);
for (var i = 0; i < t; i++) {
  promiseBuffers[i] = promiseBuffer(b)
    .then((values) => {
      // debug(values);
      debug('values have been buffered indeed');
      // eval(pry.it);
      var statement = 'INSERT INTO student(id, first, last, dob, lane, heldback, entrance) VALUES ?';
      // eval(pry.it);
      connection.query(statement, [values], function(err, res) {
        if(err) throw err;
        // debug(i + ' Last insert ID: ', res.insertId, ' affected rows: ', res.affectedRows);
      });
    });
};

Promise.all(promiseBuffers)
  .then((res) => {
    connection.end(function(err) {
      debug('connection ' + connection.threadId + ' terminated');
      // eval(pry.it);
      console.timeEnd('inserting');
    });
  })
  .catch((err) => console.log(err));

// --- PROMISE END


// connection.query('DELETE FROM student', function(err, res) {
//   if(err) throw err;
//   for (var i = 0; i < 1; i++) {  // bulkinsert not parallel. Use promises!
//     bulkinsert(100000);
//   };
//   debug(i + ' Last insert ID: ', res.insertId, ' affected rows: ', res.affectedRows);
// });
