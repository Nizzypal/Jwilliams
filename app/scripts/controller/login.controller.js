'use strict';
angular.module('jwilliams').controller('LoginCtrl', function($scope, $stateParams, $state, $http, API_URL, UserDataService){
	
	var vm = this;

	var userDataService = UserDataService

	$scope.user = {
		name:'',
		email:'',
		password:'',
		contact1:''
	};

	//Determines if page is login or registration mode
	$scope.isLogin = $stateParams.isLogin;

	//Convert string to boolean
	if ($scope.isLogin === 'false') $scope.isLogin = false;
	else if ($scope.isLogin === 'edit'){
		$scope.isLogin = 'edit';
		
		//Get userID
		$scope.userID = userDataService.getUserInfo().userID;

		//Get user information
		$http.post(API_URL + 'userInfo' + '?q=' + $scope.userID)
			.success(function(userInfo){
				$scope.user = userInfo.user;
				$scope.$apply();
			}).error(function(err) {
                  alert('warning', "Unable to get unit");
            });
	} else {
		$scope.isLogin = true;
	}

	alert("$scope.isLogin - " + $scope.isLogin);

	vm.submit = function(){
		//alert('user - ' + user.email);

		$scope.user.name = $scope.firstName + " " + $scope.lastName;

		//user is alrady a member
	    if ($scope.isLogin === true){
		    //$http.post(API_URL + 'login', user)
		    $http.post(API_URL + 'login', $scope.user)
		        .success(function(res){

		        	//Set user service information
		        	userDataService.setUserInfo({userID: res.user._id, userName: res.user.email});

		        	$state.go('main', {'userName': res.user.email});
		            //inquiryID = newInquiry.newInquiryID;
		        })
		        .error(function(err){
		            alert('warning: ' + err.message);

		            //if credentials are wrong, it means user has to register first
		            //$state.go('registration', {isLogin: false});     
		            
		            return false;
		        });		    	
		//user is new and must register		        
		} else if ($scope.isLogin === false){
		    $http.post(API_URL + 'register', $scope.user)
		        .success(function(newInquiry){
		            userDataService.setUserInfo({userID: newInquiry.user._id, userName: newInquiry.user.email});
		        	$state.go('main');
		        })
		        .error(function(err){
		            alert('warning: ' + err.message);  
		            return false;
		        });			    	
		//user edits information
		} else {
			alert();
		    $http.post(API_URL + 'editUser', $scope.user)
		        .success(function(){
		            userDataService.setUserInfo({userID: $scope.user._id, userName: $scope.user.email});
		        	$state.go('main', {'userName': $scope.user.email});
		        })
		        .error(function(err){
		            alert('warning: ' + err.message);  
		            return false;
		        });			    		
		}
	};

	$scope.submit = vm.submit;

});