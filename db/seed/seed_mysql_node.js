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

debug('Hi from' + nconf.get('root') + ' We\'ll attempt to connect to database');

var connection = mysql.createConnection({
  host     : nconf.get('db:hostIp'),
  user     : nconf.get('db:user'),
  password : nconf.get('db:password'),
  database : nconf.get('db:database')
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  debug('connected as id ' + connection.threadId);
});

// var writable = stream.Writable(__dirname + '/seed_pipe.sql');

// connection.query('SELECT * FROM teacher')
//   .stream({highWaterMark: 100})
//   .pipe(writable);

// var query = connection.query('SELECT * FROM teacher');
// query
//   .on('error', function(err) {
//     // Handle error, an 'end' event will be emitted after this as well
//     debug('the error ' + err + ' occured');
//   })
//   .on('fields', function(fields) {
//     // the field packets for the rows to follow
//     debug('inside fields');
//     // eval(pry.it);
//   })
//   .on('result', function(row) {
//     // Pausing the connnection is useful if your processing involves I/O
//     connection.pause();
//     debug('inside row' + row);
//     // eval(pry.it);
//     connection.resume();
//     // processRow(row, function() {
//     //   connection.resume();
//     //   debug('inside fields');
//     //   eval(pry.it);
//     // });
//   })
//   .on('end', function() {
//     // all rows have been received
//     debug('bye');
//   });

var values = [];
var n = 2000;

for (var i = 0; i < n; i++) {
  // values.push([Math.ceil(Math.random()*5), Math.ceil(Math.random()*5)]);
  values.push([2,2]);
}


var callback = function() {
  for (var i = 0; i < 1; i++) {
    debug(i + ' begin bulk insert');
    connection.query('INSERT INTO t (one, two) VALUES ?', [values], function(err, res) {
      if(err) throw err;
      debug(i + ' Last insert ID: ', res.insertId, ' affected rows: ', res.affectedRows);
      // eval(pry.it);
    });
  }
  // for (var i = 0; i < 1; i++) {
  //   debug(i + ' th single insertion');
  //   for (var j = 0; j < n; j++) {
  //     connection.query('INSERT INTO t (one, two) VALUES (2,2)', function(err, res) {
  //       if(err) throw err;
  //     });
  //   }
  // };



  connection.end(function(err) {
    debug('connection ' + connection.threadId + ' terminated')
  });
}

setTimeout(callback, 2000);
