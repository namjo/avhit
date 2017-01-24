var r = function(res, val) {
  return function() {
    res(val)
  }
}

var p = fetch("/foo")
  .then(res => res.status, err => console.error(err))
  .then(status => status.a.b.c)
  .catch(err => console.error(err))

p.then(status => console.log(status))

// nobody keeps their promises anymore
var p2 = p
  .then(() => {
    var t = new Promise((res)=>{
      setTimeout(r(res,3), 1000)
    })
    return t
  })
  .then(status => {
    if(status === 3) console.log(status.a.s.d)
    else console.log(status)
  })

p2.then(status => console.log(status))
p2.then(status => console.log(status))
p2.then(status => console.log(status))

// another example:

var p = Promise.resolve()
  .then(data => {
    // if you don't return the promise, the following .then and .catch
    // will execute immediately after this promise resolves.
    // However, if you return the new Promise, this promise will only be
    // considered resolved if the new Promise has settled.
    // The same holds for the above. 
    new Promise(function (resolve, reject) {
      setTimeout(Math.random() > 0.5 ? resolve : reject, 2000)
    })
  })

p.then(data => console.log('okay!'))
p.catch(data => console.log('boo!'))
