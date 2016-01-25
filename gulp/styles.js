'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass');
var browserSync = require('browser-sync');


var $ = require('gulp-load-plugins')();

module.exports = function(options) {
  gulp.task('styles', function () {
    var sassOptions = {
      style: 'expanded',
      //debug: true,
      includePaths: [
        '.',
        'bower_components/hapara-ui/dist/scss/',
        'bower_components/Bootflat/bootflat/scss/',
        'bower_components/bootstrap-sass-official/assets/stylesheets/'
      ]
    };

    var injectFiles = gulp.src([
      options.src + '/{app,components}/**/*.scss',
      '!' + options.src + '/app/app.scss',
      '!' + options.src + '/app/vendor.scss'
    ], { read: false });

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.src + '/app/', '');
        filePath = filePath.replace(options.src + '/components/', '../components/');

        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    // only inject files into app.scss
    var indexFilter = $.filter('app.scss');
    var cssFilter = $.filter('**/*.css');

    return gulp.src([
      options.src + '/app/app.scss',
      options.src + '/app/vendor.scss'
    ])
      .pipe(indexFilter)
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(indexFilter.restore())
      .pipe(sass(sassOptions)).on('error', options.errorHandler('RubySass'))
      .pipe(cssFilter)
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
	    .pipe(browserSync.reload({ stream: true }))
      .pipe(cssFilter.restore())
      .pipe(gulp.dest(options.tmp + '/serve/app/'))
      ;
  });
};
