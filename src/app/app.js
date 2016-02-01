(function() {
  'use strict';

  angular.module('sampleApp', [])
    .controller('simpleController', SimpleController);


  function SimpleController($scope) {
    $scope.myName="Zachary";
    $scope.addName= function() {
       if  ($scope.myName.startsWith ("https://" )|| $scope.myName.startsWith ("http://" ) ) {

         $scope.names.push ($scope.myName);
          $scope.myName = "";
      }
    };
    angular.extend($scope, {
      names: []
    });
  };

}(angular));
