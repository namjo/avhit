var fs = require('fs');
var dummyjson = require('dummy-json');
var path = require('path');
var debug = require('debug')('seed_classic');

// mockdata

var teachers = {
  teacher: [
    {
      last: 'Mueller',
      abbr: 'mu'
    },
    {
      last: 'Schmidt',
      abbr: 'sm'
    },
    {
      last: 'Lange',
      abbr: 'la'
    },
    {
      last: 'Schneider',
      abbr: 'sn'
    },
    {
      last: 'Kaufmann',
      abbr: 'ka'
    }
  ]
}

var subjects = {
  subject: [
    {
      id: 'de',
      title: 'Deutsch'
    },
    {
      id: 'ma',
      title: 'Mathematik'
    }
  ]
}

// Handlebars helpers

var helps = {
  randint: function() {
    // Use dummyjson randomstringom to ensure the seeded randomstringom number generator is used
    var sample = dummyjson.utils.random();
    if (sample < 0.93) return 0;
    if (sample < 0.98) return 1;
    else return 2;
  },
  randstr: function(n, charset) {
    var rs = '';
    for (var i = 0; i < n; i++) {
      rs += dummyjson.utils.randomChar(charset);
    }
    return rs;
  }
};

// dummyjson.seed = "hi";  // Deterministic behaviour for random generator.

var longString = '';

// file reading must be done synchronously or in separate threads joined together prior 
// to invoking parse method
// Problem: cant read file unless script invoked in same directory as file.
var template_student = fs.readFileSync(
  path.format({
    dir: __dirname,
    base: 'seed_student.hbs'
  }),
  {encoding: 'utf8'});
var template_teacher = fs.readFileSync(
  path.format({
    dir: __dirname,
    base: 'seed_teacher.hbs'
  }),
  {encoding: 'utf8'});
var template_subject = fs.readFileSync(
  path.format({
    dir: __dirname,
    base: 'seed_subject.hbs'
  }),
  {encoding: 'utf8'});

debug('all templates loaded');

longString += dummyjson.parse(template_student, {helpers: helps});
longString += dummyjson.parse(template_teacher, {mockdata: teachers, helpers: helps});
longString += dummyjson.parse(template_subject, {mockdata: subjects, helpers: helps});

var buffered = new Buffer(longString);

debug('all templates parsed into longString and laaaarge buffer instantiated');

fs.writeFile(
  path.format({
    dir: __dirname,
    base: 'seed_classic.sql'
  }),
  buffered,
  {encoding: 'utf8'},
  function(err, written, string) {
    if (err) return console.log(err);
    debug('... and finally done: seed_classic.sql written');
  });

debug('waiting until written into file seed_classic.sql ...');