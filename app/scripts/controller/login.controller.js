'use strict';
angular.module('jwilliams').controller('LoginCtrl', function($scope, $stateParams, $http, API_URL){
	var vm = this;

	var user = {
		email:'',
		password:''
	};

	$scope.user = user;
	$scope.email = user.email;
	$scope.password = user.password;

	vm.submit = function(){
		alert('user - ' + user.email);

	    $http.post(API_URL + 'login', user)
	        .success(function(newInquiry){
	            //inquiryID = newInquiry.newInquiryID;
	        })
	        .error(function(err){
	            alert('warning: ' + err.message);
	            return false;
	        });		
	};

	$scope.submit = vm.submit;

});