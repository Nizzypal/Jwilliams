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
	

	var userInfo = {
		name: "",
		email: ""
	};

	$scope.userInfo = userInfo;

	$scope.clicked = function() {
    	// $( "#subscribe" ).submit(function() {
			alert( "Handler for .submit() called." );
			$http.post(API_URL + 'subscriber', userInfo).success(function() {
			}).error(function(err) {
			    alert('warning', "Unable to get meals");
			});
		// });

		// api.call('list', 'subscribe', { id: 776869c525, email: {email:'nazarite_paladin@yahoo.com'} }, function (error, data) {
		//     if (error)
		//         console.log(error.message);
		//     else
		//         console.log(JSON.stringify(data)); // Do something with your data!
		// });

	};

});

