'use strict';
angular.module('jwilliams').controller('MainCtrl', function($rootScope, $scope, $state, $http, API_URL, UserDataService){
	var vm = this;

	var user = {
		email:'',
		password:''
	};
	
	//$scope.userName = $stateParams.userName;
	//$scope.token = $stateParams.token;
	$scope.userDataService= UserDataService;
	$scope.userName = $scope.userDataService.getUserInfo().userName;

	if ($scope.userName != null && $scope.userName != ''){
		$rootScope.$broadcast('USER_DEFINED', { username: $scope.userName })
	}

	$scope.submit = vm.submit;

    $scope.goRegister = function(unit) {
      $state.go("registration");   
    }	
});