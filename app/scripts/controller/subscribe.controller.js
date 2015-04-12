angular.module('jwilliams').controller('SubscribeCtrl', function($scope, $http, API_URL) {

	// $scope.city = city.value;
	// $scope.units = [];
	// $scope.currentUnit = {};
	// $http.get(API_URL + 'getItemsByCity/' + $scope.city).success(function(units) {
	// 	console.log(units);
	//     $scope.units = units;
	// }).error(function(err) {
	//     alert('warning', "Unable to get meals");
	// });

	$scope.clicked = function() {
    	$( "#subscribe" ).submit(function() {
			alert( "Handler for .submit() called." );
			$http.post(API_URL + 'subscriber').success(function() {
			}).error(function(err) {
			    alert('warning', "Unable to get meals");
			});
		});
    };
});


