'use strict';
angular.module('jwilliams').controller('LongTermCtrl', function($scope, $http, $stateParams, API_URL){
	$scope.rentalType = $stateParams.rentalType;

	$http.get(API_URL + 'getItemsByRentalType/' + $scope.rentalType).success(function(units) {
		console.log(units);
		$scope.units = units;
	}).error(function(err) {
		alert('warning', "Unable to get units");
	});	
});