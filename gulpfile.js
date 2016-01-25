/* jshint node: true */
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var _ = require('lodash');
var wrench = require('wrench');


var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});


/**
 * Default task
 */
gulp.task('default', ['clean', 'lint'], function() {
  gulp.start('build-all');
});





/**
 * Test files
 */
function testFiles() {
  return new queue({objectMode: true})
    .queue(gulp.src(fileTypeFilter(bowerFiles(), 'js')))
    .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
    .queue(appFiles().pipe(g.filter(['**/*.js', '!**/*.map'])))
    .queue(gulp.src(['./src/app/**/*_test.js', './.tmp/src/app/**/*_test.js']))
    .done();
}


/**
 * All AngularJS application files as a stream
 */
function appFiles () {
  var files = [
    './.tmp/' + bower.name + '-templates.js',
    './.tmp/src/app/**/*.js',
    '!./.tmp/src/app/**/*_test.js',
    '!./.tmp/src/app/**/*_spec.js',
    './src/app/**/*.js',
    '!./src/app/**/*_test.js',
    '!./src/app/**/*.spec.js'
  ];

  return gulp.src(files)
    .pipe(g.sourcemaps.init())
    .pipe(g.babel())
    .on('error', function(err) {
      console.log(err.toString());
    })
    .pipe(g.angularFilesort())
    .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp'));
}

/**
 * Filter an array of files according to file type
 *
 * @param {Array} files
 * @param {String} extension
 * @return {Array}
 */
function fileTypeFilter (files, extension) {
  var regExp = new RegExp('\\.' + extension + '$');
  return files.filter(regExp.test.bind(regExp));
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist (ext, name, opt) {
  opt = opt || {};
  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(opt.ngAnnotate ? g.ngAnnotate : noop)
    .pipe(opt.ngAnnotate ? g.rename : noop, name + '.annotated.' + ext)
    .pipe(opt.ngAnnotate ? gulp.dest : noop, './dist')
    .pipe(ext === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(gulp.dest, './dist')();
}

