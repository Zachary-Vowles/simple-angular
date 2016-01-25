'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync'),
  plumber = require('gulp-plumber'),
  bower = require('../bower'),
  gutil = require('gulp-util');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('scripts', function () {
    var jsFilter = $.filter('**/*.js');

    var scriptFiles = [options.src + '/{app,components}/**/*.js'];
    var environments = ['localhost', 'dev', 'test',  'prod'];
    var environment = 'localhost';

    if (gutil.env && gutil.env.env) {

      environment = gutil.env.env;
    }

    for(var count = 0; count < environments.length; count ++) {
      if (environments[count] !== environment) {
        scriptFiles.push('!' + options.src + '/app/environments/' + environments[count] + '.js');
      }
    }

    var versionFilter = $.filter(function (file) {
      return /orbit-version/.test(file.path);
    }, {restore: true});

    return gulp.src(scriptFiles)
      .pipe(plumber({errorHandler: function (err) {
        console.error(err.message);
        this.emit('end');
        }}))
      .pipe(versionFilter)
      .pipe($.replace(/1.0.0/, bower.version))
      .pipe(versionFilter.restore())
      .pipe($.sourcemaps.init())
      .pipe($.babel({blacklist: ['strict']}))
	    .pipe($.ngAnnotate())
      .pipe($.sourcemaps.write('.'))
      .pipe(jsFilter)
      .pipe($.jshint('./.jshintrc'))
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe(jsFilter.restore())
      .pipe(gulp.dest(options.tmp + '/serve'))
      .pipe(browserSync.reload({ stream: true }))
      .pipe($.size({title: options.tmp + '/serve', showFiles: true}));
  });
};
