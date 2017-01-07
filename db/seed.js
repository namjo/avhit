// var dummyjson = require('dummy-json');

// var template = {
//   "users": [
//     {{#repeat 2}}
//     {
//       "id": {{@index}},
//       "name": "{{firstName}} {{lastName}}",
//       "work": "{{company}}",
//       "email": "{{email}}",
//       "dob": "{{date '1900' '2000' 'YYYY'}}",
//       "address": "{{int 1 100}} {{street}}",
//       "city": "{{city}}",
//       "optedin": {{boolean}}
//     }
//     {{/repeat}}
//   ],
//   "images": [
//     {{#repeat 3}}
//     "img{{@index}}.png"
//     {{/repeat}}
//   ],
//   "coordinates": {
//     "x": {{float -50 50 '0.00'}},
//     "y": {{float -25 25 '0.00'}}
//   },
//   "price": "${{int 0 99999 '0,0'}}"
// }

// var result = dummyjson.parse(template);

var fs = require('fs');
var dj = require('dummy-json');

var template = fs.readFileSync('db/seed.hbs', {encoding: 'utf8'});
// var template = '{\
//     {{#repeat 3}}\
//     "name": {{firstName}},\
//     "age": {{int 18 65}}\
//     {{/repeat}}\
//   }';
var result = dj.parse(template);

console.log(result);