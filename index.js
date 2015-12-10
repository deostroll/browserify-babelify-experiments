var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var sourceRoot = './es6-code';
var source = require('vinyl-source-stream');
var targetDest = './dist';

//clean the dest

function cleanDestination(target) {
  return new Promise(function(resolve, reject){
    console.log('Cleaning dest...');
    rimraf(target, function(err){
      if(err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

function createDestination(target) {
  console.log('Creating dest...');
  return new Promise(function(resolve, reject){
    mkdirp(target, function(err){
      if(err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

function transpile(mainFile, targetFile) {
  console.log('transpiling...');
  return new Promise(function(pass, fail){
    browserify(mainFile, {deps: true})
    .on('error', function(err){
      fail(err);
    })
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .on('error', function(err){
      fail(err);
    })
    .pipe(fs.createWriteStream(targetFile))
    .on('close', function(){      
      pass();
    });
  });
}

cleanDestination(targetDest).then(function(){
  return createDestination(targetDest)
}).then(function(){
  return transpile('./es6-code/main.js', './dist/main.js');
}).then(function(){
  fs.readFile('./dist/main.js', {
    encoding: 'utf8'
  }, function(err, data){
    console.log(data);
  });
  console.log('done');
}, function(err){
  console.log('Error: Transpilation Failed');
  console.log('Message:', err.message);
  console.log('Stack:\n', err.stack);
})
