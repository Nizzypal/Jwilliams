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
  .module('jwilliams', ['ui.router', 'ngAnimate']);

angular.module('jwilliams').config(function($stateProvider, $urlRouterProvider) {


  $stateProvider.state('main', {
    url: '/',
    templateUrl: '/views/main.html'
  });

  $stateProvider.state('bgc', {
    url: '/bgc',
    templateUrl: '/views/bgc.html'
  });

  //    $stateProvider.state('logout',{
  //        url:'/logout',
  //        controller: 'LogoutCtrl'
  //                                    });

  $urlRouterProvider.otherwise('/');
});

angular.module('jwilliams').directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    templateUrl: '/views/modalTemplate.html' // See below
  };
});

angular.module('jwilliams').directive('wrapOwlcarousel', function () {  
    return {  
        restrict: 'E',  
        link: function (scope, element, attrs) {  
            var options = scope.$eval($(element).attr('data-options'));  
            $(element).owlCarousel(options);  
        }  
    };  
})

.constant('API_URL', 'http://localhost:3030/')
