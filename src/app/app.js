(function() {
  'use strict';

  angular.module('sampleApp', [])
    .controller('simpleController', SimpleController);


  function SimpleController(scope) {
    angular.extend(scope, {
      names: []
    });
  };

}(angular));

