'use strict'

// seed database
var Chance = require('chance');
var debug = require('debug')('seed_promise');
var mysql = require('mysql');
var nconf = require('nconf');
var path = require('path');
var pry = require('pryjs');
var stream = require('stream');

const Connection = require('mysql/lib/Connection');
const Pool = require('mysql/lib/Pool');
const Promise = require('bluebird');

var chance = new Chance();
nconf.argv().file({ file: nconf.get('root') + "config.json" })

var idCount = 0;

var bufferedValues = function(n) {
  var values = new Array(n);
  for (var i = 0; i < n; i++) {
    var id = ++idCount;
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
    values[i] = [id, first, last, dob, lane, heldback, entrance];
  }
  return values;
}

Promise.promisifyAll([
  Connection,
  Pool
]);

var connection = mysql.createConnection({
  host     : nconf.get('db:hostIp'),
  user     : nconf.get('db:user'),
  password : nconf.get('db:password'),
  database : nconf.get('db:database')
});

// begin with buffer computation even before connection setup.
var n = 5000;  // buffersize
var q = 1;    // number of queries
var promiseBuffers = [];
for (var i = 0; i < q; i++) {
  var promiseBuffer = new Promise((resolve, reject) => {  // how about working with yield ... after resolve(bufVals)
    var bufVals = bufferedValues(n);
    resolve(bufVals);
  });
  promiseBuffers.push(promiseBuffer);
};

var promiseBufferQueries = [];

connection
  .connectAsync()
  .then((result) => { // connection established
    debug('Established connection.', connection.threadId);
    return connection.queryAsync('DELETE FROM student');
  }, (error) => { debug('Connection error.', error); })
  .then((result) => { // student table empty. Now we can repopulate it
    Promise.map(promiseBuffers, (bufVals) => {
      return connection.queryAsync('INSERT INTO student VALUES ?', [bufVals]);
    })
    .catch((error) => {
      debug('There must have been a query error in at least one of those queries.', error);
    })
    .then((result) => {
      debug('Dummy values inserted. ');
      return connection.endAsync();
    })
    .then(() => {
      debug('connection successfully closed');
    }, (error) => { debug('Error closing connection ' +  error) });

    // for (var i = 0; i < q; i++) {
    //   promiseBuffers[i].then((bufVals) => {
    //     promiseBufferQueries.push(connection.queryAsync('INSERT INTO student VALUES ?', [bufVals]));
    //   });
    // };
    // eval(pry.it)
    // Promise.all(promiseBufferQueries)
    //   .then((result) => {
    //     console.log(3);
    //     eval(pry.it)
    //     return connection.endAsync();
    //   }, (error) => { debug('At least one query failed ' + error); })
    //   .then((result) => {
    //     console.log(4);
    //     debug('Connection closed');
    //   }, (error) => { debug('Error during connection close ' + error); });
  });

// This doesn't work. There seems to be a problem with Promise.all as it is being handed over to the next then
// connection
//   .connectAsync()
//   .then((result) => { // connection established
//     debug('Established connection.', connection.threadId);
//     console.log(1);
//     return connection.queryAsync('DELETE FROM student');
//   }, (error) => { debug('Connection error.', error); })
//   .then((result) => { // student table empty. Now we can repopulate it
//     // eval(pry.it)
//     console.log(2);
//     for (var i = 0; i < q; i++) {
//       promiseBuffers[i].then((bufVals) => {
//         // eval(pry.it)
//         promiseBufferQueries.push(connection.queryAsync('INSERT INTO student VALUES ?', [bufVals]));
//         // connection.queryAsync('INSERT INTO student VALUES ?', [bufVals]);
//       }, (errer) => {debug('error', error)});
//     };
//     var pa = Promise.all(promiseBufferQueries)
//     eval(pry.it)
//     return Promise.all(promiseBufferQueries);
//   }, (error) => { debug('Query error.', error); })
//   .then((promiseall) => {
//     eval(pry.it); // only after this the queries get dispatched! strangely promiseall === [] here, but pa above is not [].
//     promiseall.then((result) => {
//       console.log(3);
//       // eval(pry.it)
//       return connection.endAsync();
//     }, (error) => { debug('At least one query failed ' + error); })
//     .then((result) => {
//       console.log(4);
//       debug('Connection closed');
//     }, (error) => { debug('Error during connection close ' + error); });
//
//
//     // console.log(3);
//     // debug('Connection closed');
//     // return connection.endAsync();
//   }, (error) => { debug('At least one query failed ' + error); })
//   // .catch((error) => { debug('Error during connection close ' + error); });
//
//
//   // .then((result) => {
//   //   eval(pry.it); // only after this the queries get dispatched!
//   //   console.log(3);
//   //   debug('Connection closed');
//   //   return connection.endAsync();
//   // }, (error) => { debug('At least one query failed ' + error); })
//   // .catch((error) => { debug('Error during connection close ' + error); });
