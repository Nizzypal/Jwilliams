'use strict'

angular.module('jwilliams').directive('jwNavbarActions', function(){
        return {
            restrict: 'AE',
            templateUrl: 'app/views/navbar-actions.tpl.html',
            replace: true,
            scope: {},
            controller: function($scope, $stateParams, $state, $http, API_URL, UserDataService){
                
                //Get current user's name and check
                $scope.username = UserDataService.getUserInfo().userName;
                // var == null - standard way of checking
                if ($scope.username == null || $scope.username == '') {
                    $scope.username = "Login"    
                }

                $scope.login = function(){
                    $state.go("login", {"isLogin": true});
                };
            },
            link: function($scope, $element, $attrs, $controller){
                 
                 $scope.$on('USER_DEFINED', function (event, args) {
                    $scope.username = args.username;
                    $('a#login').html($scope.username);
                 });
            }
        };

});
