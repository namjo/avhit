var a = [];

var p = new Promise((resolve, reject) => {
  for (var i = 0; i < 10000; i++) {
    console.log(i);
  }
  resolve("done");
})

console.log("hi all")

p.then((done) => {
  console.log("then is " + done);
})

// var Chance = require('chance');
// var fs = require('fs');
// var pry = require('pryjs');
// var path = require('path');
// var nconf = require('nconf');
// var debug = require('debug')('f');
//
// var chance = new Chance();
//
// function stats (file) {
//   return new Promise((resolve, reject) => {
//     fs.stat(file, (err, data) => {
//       if (err) {
//         return reject (err)
//       }
//       resolve(data)
//     })
//   })
// }
//
// Promise.all([
//   stats('index.js'),
//   stats('rough.js'),
//   stats('config.json')
// ])
// .then((data) => console.log(data))
// .catch((err) => console.log(err))
//
// function* f() {
//   console.log("Starting")
//   var file = yield readFile("./app.js")
//   console.log(file.toString())
// }
