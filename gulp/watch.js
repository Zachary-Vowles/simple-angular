'use strict';

var gulp = require('gulp');
var fs = require('fs');
var browserSync = require('browser-sync');
var lodash = require("lodash");

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
  // cause this to trigger after no activity for 1 second
  gulp.task('linked-folder', lodash.debounce(function() {
    gulp.start('inject');
  }, 1000));


  gulp.task('watch', [ 'inject'], function () {

    //var linkedJsAssets = fs.realpathSync('./bower_components/ui-components-ng/dist/') + '/**/*.js';
    //var linkedScssAssets = fs.realpathSync('./bower_components/ui-components-ng/dist/') + '/**/*.scss';
    //if (linkedJsAssets || linkedScssAssets) {
    //  gulp.watch([linkedJsAssets, linkedScssAssets], ['linked-folder']);
    //}

    gulp.watch([options.src + '/**/*.html', 'bower.json'], ['inject']);

    gulp.watch([
      options.src + '/{app,components}/**/*.css',
      options.src + '/{app,components}/**/*.scss'
    ]).on('change', function(event) {
      if(isOnlyChange(event)) {
        gulp.start('styles');
      } else {
        gulp.start('inject');
      }
    });

    // removed test, that is much better in test:auto and run specifically as part of build
    gulp.watch(options.src + '/{app,components}/**/*.js').on('change', function(event) {
      if(isOnlyChange(event)) {
        gulp.start('scripts');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch([options.src + '/{app,components}/**/*.html', '!./src/app/index.html'], function(event) {
      browserSync.reload(event.path);
    });
  });
};
