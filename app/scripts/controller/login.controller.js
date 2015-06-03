'use strict';
angular.module('jwilliams').controller('LoginCtrl', function($scope, $stateParams, $state, $http, API_URL, UserDataService){
	
	var vm = this;

	var userDataService = UserDataService

	// var user = {
	// 	email:'',
	// 	password:''
	// };

	$scope.user = {
		email:'',
		password:''
	};


	// $scope.email = user.email;
	// $scope.password = user.password;

	//Determines if page is login or registration mode
	$scope.isLogin = $stateParams.isLogin;
	if($scope.isLogin === 'false') $scope.isLogin = false;
	else $scope.isLogin = true;

	alert("$scope.isLogin - " + $scope.isLogin);

	vm.submit = function(){
		//alert('user - ' + user.email);

		//user is alrady a member
	    if ($scope.isLogin){
		    //$http.post(API_URL + 'login', user)
		    $http.post(API_URL + 'login', $scope.user)
		        .success(function(res){

		        	//Set user service information
		        	userDataService.getUserInfo().userID = res.user._id;

		        	$state.go('main');
		            //inquiryID = newInquiry.newInquiryID;
		        })
		        .error(function(err){
		            alert('warning: ' + err.message);

		            //if credentials are wrong, it means user has to register first
		            $state.go('registration', {isLogin: false});     
		            
		            return false;
		        });		    	
		//user is new and must register		        
		} else {
		    $http.post(API_URL + 'register', user)
		        .success(function(newInquiry){
		            //inquiryID = newInquiry.newInquiryID;
		        })
		        .error(function(err){
		            alert('warning: ' + err.message);  
		            return false;
		        });			    	
		}
	};

	$scope.submit = vm.submit;

});