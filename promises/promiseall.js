'use strict'

var debug = require('debug')('promiseall');
var Promise = require('bluebird');
var pry = require('pryjs');

var promiseCount = 50;
var total = 0;

function time(n) {
  return function (resolve, reject) {
    var t = Math.random()*n;
    setTimeout((() => {
      total += t;
      resolve(t);   // resolves only after a certain time!
    }), t);
  }
}

var p = new Promise(time(500));    // resolves only after that certain time t with that value t.

p.then((t) => {
  console.time('create promise array');
  var promiseArray = [];
  // promiseArray.push(Promise.reject(new Error('Could not fulfill the first promise.')));
  for (var i = 0; i < promiseCount; i++) {
    promiseArray.push(new Promise(time(1000))); // strangely the promise won't start working as of here ...
  };
  // promiseArray.push(Promise.reject(new Error('Could not fulfill the last promise.')));
  console.timeEnd('create promise array');

  console.time('create allPromises PROMISES array');
  var allPromises = Promise.all(promiseArray);
  console.timeEnd('create allPromises PROMISES array');

  console.time('all Promises settled');
  eval(pry.it);
  // allPromises.then((resVals) => {
  //   eval(pry.it)
  //   debug('hi')
  // })
  return allPromises;
})
  .then((allPromises) => {
    eval(pry.it);
    allPromises.then((resVals) => {
      eval(pry.it)
    }, (x) => {
      console.log(x)
      eval(pry.it) 
    })
    debug('average promise resolve time: ' + total/promiseCount);
    console.timeEnd('all Promises settled');
  })
.catch((error) => {
  debug(error)
});
