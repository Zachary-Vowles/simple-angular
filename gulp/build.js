'use strict';

var gulp = require('gulp'),
  filelog = require('gulp-filelog'),
  bower = require('../bower'),
  stripDebug = require('gulp-strip-debug'),
	prettify = require('gulp-js-prettify');

var rev = require('gulp-rev');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function (options) {
  gulp.task('html', ['inject', 'partials'], function () {
    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter(['scripts/sample.min.js', '!scripts/vendor.js']);
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(options.tmp + '/serve/*.html')
      .pipe(assets = $.useref.assets())
      .pipe(rev())
      .pipe(jsFilter)
      .pipe(stripDebug())
	    //.pipe($.babel({blacklist: ['strict'], sourceMap: false, comments: false}))
	    //.pipe($.ngAnnotate())
	    //.pipe(prettify({collapseWhitespace: true}))
      .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', options.errorHandler('Uglify'))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe($.replace('../../bower_components/bootstrap-sass-official/assets/fonts/bootstrap/', '../fonts/'))
      .pipe($.csso())
      .pipe(cssFilter.restore())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.size({title: options.dist + '/', showFiles: true}));
  });

  // Only applies for fonts from bower dependencies
  // Custom fonts are handled by the "other" task
  gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe($.flatten())
      .pipe(gulp.dest(options.dist + '/fonts/'));
  });

  gulp.task('other', function () {
    return gulp.src([
      options.src + '/**/*',
      '!' + options.src + '/**/*.{html,css,js,scss}'
    ])
      .pipe(gulp.dest(options.dist + '/')).on('error', options.errorHandler('other-copy'));
  });

  gulp.task('clean', function (done) {
    $.del([options.dist + '/', options.tmp + '/'], {force:true}, done);
  });

  gulp.task('build', [ 'html', 'fonts', 'other']);
};
