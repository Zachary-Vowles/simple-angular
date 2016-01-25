
module.exports = function ( karma ) {
  process.env.PHANTOMJS_BIN = 'node_modules/karma-phantomjs-launcher/node_modules/.bin/phantomjs';

  var configuration = {
    /**
     * From where to look for files, starting with the location of this file.
     */
    basePath: './',

    /**
     * Filled by the task `gulp karma-conf`
     */
    files: [
        'bower_components/angular/angular.js',
        'bower_components/lodash/lodash.js',
        'bower_components/angular-gettext/dist/angular-gettext.js',
        'bower_components/angular-gapi/modules/gapi-client.js',
        'bower_components/ngstorage/ngStorage.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/ui-components-ng/dist/**/*.js',
        'bower_components/ui-header-ng/dist/**/*.js',
        'src/app/**/*.js',
        'src/app/**/*.html'
      ],

    exclude: [
      'src/app/app.js',
      'src/app/environments/dev.js',
      'src/app/environments/test.js',
      'src/app/environments/uat.js',
      'src/app/environments/production.js'
    ],
    preprocessors: {
      'src/**/*.js': ['babel'],
      'test/**/*.js': ['babel'],
      'src/**/*.html':['ng-html2js']
    },
    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-jasmine', 'karma-phantomjs-launcher', 'karma-ng-html2js-preprocessor', 'karma-babel-preprocessor' ],
    'babelPreprocessor': {
      options: {
        sourceMap: 'inline'
      },
      filename: function(file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function(file) {
        return file.originalPath;
      }
    },
    ngHtml2JsPreprocessor: {
      // or define a custom transform function
      cacheIdFromPath: function(file) {
        console.log(file);
        var templateName = file.toString();

        if (templateName.indexOf('src/app/') === 0) {
          templateName = 'highlights' + templateName.substr(templateName.lastIndexOf('/'));
        }

        console.log('Mapping template ', file.toString(), ' to "', templateName, '"');

        return templateName;
      },

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'hapara.highlights.templates'
    },

    /**
     * How to report, by default.
     */
    reporters: 'progress',

    /**
     * Show colors in output?
     */
    colors: true,

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9099,
    runnerPort: 9100,
    urlRoot: '/',

    /**
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9099/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      'PhantomJS'
    ]
  };

  // determine if we have localised settings
  var localConfigFilename = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.karma/karma-runner.local.js';

  try {
    var localConfig = require(localConfigFilename);

    if (localConfig) {
      console.log('Found local karma config in ', localConfigFilename, ' loading...');
      localConfig(configuration);
    }
  } catch (localConfigErr) {
    console.log('No local config found in ', localConfigFilename);
  }

  karma.set(configuration);
};
