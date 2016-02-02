(function() {
  'use strict';

  angular.module('sampleApp', ["ngCookies"])
    .controller('simpleController', SimpleController);


  function SimpleController($scope, $cookies) {



