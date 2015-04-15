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
    resolve:{

         // Example using function with simple return value.
         // Since it's not a promise, it resolves immediately.
         city:  function(){
            return {value: 'makati'};
         }
    }
  });

  $stateProvider.state('subscribe', {
    url: '/subscribe',
    templateUrl: '/views/subscribe.html',
    controller:  'SubscribeCtrl'
  });

  $stateProvider.state('createUnit', {
    url: '/createUnit',
    templateUrl: '/views/createUnit.html',
    controller:  'CreateUnitCtrl'
  });

  // $stateProvider.state('sendMessage', {
  //   //url: '/sendMessage',
  //   templateUrl: '/views/contact.html',
  //   controller:  'MessageCtrl'
  // });  

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
});

angular.module('jwilliams').directive('endRepeat', ['$timeout', function ($timeout) {
			return {
				restrict: 'A',
				link: function (scope, element, attr) {
					if (scope.$last === true) {
						$timeout(function () {
							scope.$emit('ngRepeatFinished');
						});
					}
				}
			}
		}])

.constant('API_URL', 'http://localhost:3030/')
