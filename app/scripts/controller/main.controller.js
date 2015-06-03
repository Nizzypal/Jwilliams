'use strict';
angular.module('jwilliams').controller('MainCtrl', function($scope, $stateParams, $state, $http, API_URL){
	var vm = this;

	var user = {
		email:'',
		password:''
	};
	
	$scope.token = $stateParams.token;
	$scope.userID = $stateParams.userID;

	$scope.submit = vm.submit;
});