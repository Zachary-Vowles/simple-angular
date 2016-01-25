'use strict';

var gulp = require('gulp'),
  bower = require('../bower');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files']
});

module.exports = function (options) {
  gulp.task('partials', function () {
    // opts not used, need to discus merits with Rowan
    var htmlminOpts = {
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: false,
      collapseBooleanAttributes: true,
      removeRedundantAttributes: true
    };

    return gulp.src([
      options.src + '/{app,components}/**/*.html',
      options.tmp + '/serve/{app,components}/**/*.html',
      '!' + options.src + '/{app,components}/index.html'
    ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: bower.name + ".templates",
        base: function(file) {
          if (file.relative.indexOf('app/') === 0) {
            return 'sample/' + file.relative.substr(file.relative.lastIndexOf('/'));
          } else {
            return file.relative;
          }
        },
        standalone: true
      }))
      .pipe(gulp.dest(options.tmp + '/partials/'));
  });
};
