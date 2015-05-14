'use strict';
angular.module('jwilliams').controller('ShortTermCtrl', function($scope, $http, $state, $stateParams, API_URL){
	$scope.rentalType = $stateParams.rentalType;

	$http.get(API_URL + 'getItemsByRentalType/' + $scope.rentalType).success(function(units) {
		console.log(units);
		$scope.units = units;
	}).error(function(err) {
		alert('warning', "Unable to get units");
	});	

	$scope.goView = function(unit) {
		$state.go("viewUnit", {
		  "unitId": unit._id
		});
	};	
});