'use strict';

/**
 * @ngdoc overview
 * @name skitchenApp
 * @description
 * # skitchenApp
 *
 * Main module of the application.
 */
angular
  .module('jwilliamsAdmin', ['ui.router', 'ngAnimate']);

angular.module('jwilliamsAdmin').config(function($stateProvider, $urlRouterProvider) {


  $stateProvider.state('admin', {
    url: '/',
    templateUrl: '/app/admin/views/dashboard.html'
  });
    
    $stateProvider.state('createUnit', {
    url: '/createUnit',
    templateUrl: '/app/admin/views/createUnit.html'
  });


  $urlRouterProvider.otherwise('/');
})

.constant('API_URL', 'http://localhost:3030/')
