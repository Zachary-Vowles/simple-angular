'use strict';

var gulp = require('gulp'),
  filelog = require('gulp-filelog'),
  bower = require('../bower'),
  gutil = require('gulp-util');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function (options) {
  gulp.task('inject', ['partials', 'scripts', 'styles'], function () {
    var injectStyles = gulp.src([
      options.tmp + '/serve/{app,components}/**/*.css',
      '!' + options.tmp + '/serve/app/vendor.css'
    ], {read: false});

    var files = [
        options.tmp + '/serve/{app,components}/**/*.js',
        '!' + options.tmp + '/serve/{app,components}/**/*.spec.js',
        '!' + options.tmp + '/serve/{app,components}/**/*.test.js',
        '!' + options.tmp + '/serve/{app,components}/**/*_test.js',
        '!' + options.tmp + '/serve/{app,components}/**/*.mock.js'
      ];

    var injectScripts = gulp.src(files)
        .pipe($.angularFilesort());
        //.pipe(filelog());

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/serve', options.tmp + '/partials'],
      addRootSlash: false
    };

    var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', {read: false});
    var partialsInjectOptions = {
      starttag: '<!-- inject:partials -->',
      ignorePath: options.tmp + '/partials',
      addRootSlash: false
    };

    // check for our environment file
    var environment = 'localhost';

    if (gutil.env && gutil.env.env) {
      environment = gutil.env.env;
    }

    gulp.src([options.src + '/app/environments/' + environment + '.html'], {read:false})
    .pipe(filelog());

    var environmentFile = gulp.src([options.src + '/app/environments/' + environment + '.html']);
    var environmentOptions = {
      starttag: '<!-- inject:environment.html -->',
      transform: function(filePath, file) {
        // inject entire file contents
        var envHtml = '<!-- environment: ' + environment + ', version = ' + bower.version + ' -->';
        envHtml += file.contents.toString('utf8');

        return envHtml;
      }
    };


    var wiredepOptions = {
      directory: 'bower_components',
      exclude: [/waypoints\.js/,  /bootstrap\.css/, /bootstrap\.js/]
    };

    return gulp.src(options.src + '/app/index.html')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe($.inject(environmentFile, environmentOptions))
      .pipe(wiredep(wiredepOptions))
      .pipe(gulp.dest(options.tmp + '/serve'));

  });
};
