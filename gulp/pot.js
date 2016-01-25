'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

module.exports = function (options) {
  gulp.task('pot', ['scripts'], function () {
    return gulp.src(['po/*.html',
        options.tmp + '/serve/**/*.js',
        options.src + '/app/**/*.html',
        '!' + options.src + '/app/index.html'])
      .pipe($.filter(['**/*.js', '**/*.html', '!**/*.map']))
      .pipe($.angularGettext.extract('template.pot', {
        // options to pass to angular-gettext-tools...
      }))
      .pipe(gulp.dest('po/'));
  });

  gulp.task('compile-translations', ['pot', 'test-translations'], function () {
    return gulp.src('./po/**/*.po')
      .pipe($.angularGettext.compile())
      .pipe(gulp.dest('./src/app/i18n'));
  });

  gulp.task('test-translations', ['pot'], function () {
    return gulp.src('po/**/*.pot')
      .pipe($.testI18n())
      .pipe(gulp.dest('./po'));
  });
}
