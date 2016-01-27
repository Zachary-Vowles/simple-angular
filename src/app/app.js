(function() {
  'use strict';

  angular.module('sampleApp', [])
    .controller('simpleController', SimpleController);


  function SimpleController($scope) {
  $scope.myName="Zachary";
  $scope.addName= function() {
  $scope.names.push ($scope.myName)
  };
    angular.extend($scope, {
      names: []
    });
  };

}(angular));
