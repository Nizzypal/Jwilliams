'use strict';
angular.module('jwilliams').controller('MainCtrl', function($rootScope, $scope, $stateParams, $state, $http, API_URL){
	var vm = this;

	var user = {
		email:'',
		password:''
	};
	
	$scope.token = $stateParams.token;
	$scope.userName = $stateParams.userName;

	if ($scope.userName != null && $scope.userName != ''){
		$rootScope.$broadcast('USER_DEFINED', { username: $scope.userName })
	}

	$scope.submit = vm.submit;

    $scope.goRegister = function(unit) {
      $state.go("registration");   
    }	
});