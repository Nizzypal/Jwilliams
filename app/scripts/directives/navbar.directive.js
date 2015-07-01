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

                    //Check user name to know if login or registration will be done
                    if ($scope.username === "Login" ){
                        $state.go("login", {"isLogin": true});
                    }
                    else {
                        $state.go("registration", {"isLogin": "edit"});
                    }
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
