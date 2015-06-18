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
  //.module('jwilliams', ['ui.router', 'ngAnimate', 'ui.bootstrap']);

angular.module('jwilliams').config(function($stateProvider, $urlRouterProvider) {


  $stateProvider.state('main', {
    //url: '/?userID&token',
    url: '/',
    templateUrl: '/views/main.html',
    controller: 'MainCtrl'
  });

  $stateProvider.state('registration', {
    url: '/registration/:isLogin',
    templateUrl: '/views/signup.html',
    controller: 'LoginCtrl'
  });

  $stateProvider.state('login', {
    url: '/login/:isLogin',
    templateUrl: '/views/login.html',
    controller: 'LoginCtrl'
  });

  $stateProvider.state('bgc', {
    url: '/bgc',
    templateUrl: '/views/bgc.html'
  });

  $stateProvider.state('makati', {
    //url: '/makati/:userID',
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

  $stateProvider.state('longTerm', {
  url: '/rental/:rentalType',
  templateUrl: '/views/city.html',
  controller: 'LongTermCtrl'
  });

  $stateProvider.state('shortTerm', {
  url: '/rental/:rentalType',
  templateUrl: '/views/city.html',
  controller: 'ShortTermCtrl'
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
    //url: '/viewUnit/:unitID?userID',
    url: '/viewUnit/:unitID',
    templateUrl: '/views/unit.html',
    controller: 'ViewUnitCtrl'
  });

    $stateProvider.state('inquiry', {
    //url: '/viewUnit/inquiry/:inquiryID',
    //url: '/viewUnit/inquiry?inquiryID&unitID&userID',
    url: '/viewUnit/inquiry',
    templateUrl: '/views/inquiry.html',
    controller: 'InquiryCtrl'
  });

  //    $stateProvider.state('logout',{
  //        url:'/logout',
  //        controller: 'LogoutCtrl'
  //                                    });

    $stateProvider.state('reqeust-inquiry', {
      url:'/messages',
      templateUrl: '/views/reqeust-inquiries.html',
      controller: 'ReqInqCtrl'
      // resolve: {
      //   userIDRes: function(){
      //     var startNo = location.hash.search('userID=');
      //     startNo = startNo + 'userID='.length;
      //     var endNo = location.hash.search('&');
      //     var userID = location.hash.substring(startNo, endNo);
      //     return {
      //       value: userID
      //     };
      //   }
      // }
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
