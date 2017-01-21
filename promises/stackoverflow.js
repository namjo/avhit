var pry = require('pryjs');

var promiseCount = 2000;
var time = 10000;
var maxT = 0;

function resolveAfter(n) {
  return function (resolve, reject) {
    var t = Math.random()*n;
    setTimeout(() => {
      resolve(t);   // Promise resolves after random time t between 0 and n ms
    }, t);
  }
}

// initial promise p
var p = new Promise(resolveAfter(time));

console.time('create promise array');
var promiseArray = [];
promiseArray.push(p);
for (var i = 0; i < promiseCount; i++) {
  // strangely the new promise won't start executing the resolveAfter(time)
  // function as of here ...
  var pr = new Promise(resolveAfter(time));
  promiseArray.push(pr);
};
console.timeEnd('create promise array');

eval(pry.it)

// however, the initial promise p did settle in the meantime
console.time('initial promise p settled');
p.then((t) => {
  console.log('initial promise p settle time: ' + t);
  eval(pry.it)
  console.timeEnd('initial promise p settled');
})
.catch((error) => {console.log(error)});

console.time('create allPromises PROMISES array');
var allPromises = Promise.all(promiseArray);
console.timeEnd('create allPromises PROMISES array');

// ... but as of here
console.time('all Promises settled');
allPromises.then((allResolvedTs) => {
  console.timeEnd('all Promises settled');
})

// The console output verifies this:
// create promise array: 18587ms
// create allPromises PROMISES array: 5515ms
// all Promises settled: 10850ms
// initial promise p settled: 0ms