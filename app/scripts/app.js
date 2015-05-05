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

  $stateProvider.state('makati', {
    url: '/makati',
    templateUrl: '/views/city.html',
    controller: 'AreaCtrl',
    resolve: {

      // Example using function with simple return value.
      // Since it's not a promise, it resolves immediately.
      city: function() {
        return {
          value: 'makati'
        };
      }
    }
  });

  $stateProvider.state('subscribe', {
    url: '/subscribe',
    templateUrl: '/views/subscribe.html',
    controller: 'SubscribeCtrl'
  });

  $stateProvider.state('createUnit', {
    url: '/createUnit',
    templateUrl: '/views/createUnit.html',
    controller: 'CreateUnitCtrl'
  });
    
    $stateProvider.state('viewUnit', {
    url: '/viewUnit/:unitId',
    templateUrl: '/views/unit.html',
    controller: 'ViewUnitCtrl'
  });

    $stateProvider.state('inquiry', {
    //url: '/viewUnit/inquiry/:inquiryID',
    url: '/viewUnit/inquiry?inquiryID&unitID',
    templateUrl: '/views/inquiry.html',
    controller: 'InquiryCtrl'
  });

  //    $stateProvider.state('logout',{
  //        url:'/logout',
  //        controller: 'LogoutCtrl'
  //                                    });

    $stateProvider.state('reqeust-inquiry', {
      url:'/messages',
      templateUrl: '/views/reqeust-inquiries.html'
      //controller:
    });

  $urlRouterProvider.otherwise('/');
});

angular
  .module('jwilliamsAdmin', ['ui.router']);
angular.module('jwilliamsAdmin').config(function($stateProvider, $urlRouterProvider) {

  // $stateProvider.state('createUnit', {
  //   url: '/createUnit',
  //   templateUrl: '/views/createUnit.html',
  //   controller:  'CreateUnitCtrl'
  // });

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

angular.module('jwilliams').directive('wrapOwlcarousel', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      var options = scope.$eval($(element).attr('data-options'));
      $(element).owlCarousel(options);
    }
  };
});

angular.module('jwilliams').directive('endRepeat', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        scope.slides = 1;
        if (scope.$last === true) {
          $timeout(function() {
            scope.$emit('ngRepeatFinished',scope.slides);
          });
          attrs.$observe('slides', function(value) {
            scope.slides = value;
          });
        }
      }
    }
  }
])

//constants
.constant('API_URL', 'http://localhost:3030/')
// .constant('PIX_HEIGHT', 200);
// .constant('PIX_WIDTH', 200);
