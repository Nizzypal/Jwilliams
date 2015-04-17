angular.module('jwilliams').controller('SubscribeCtrl', function($scope, $http, API_URL) {

//var mc = new mcapi.Mailchimp('7c9449737b73d44ba6fd130fba22a56b-us10');
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

	  "7c9449737b				 .lists.subscribe({apikey: "7c9449737b73d44ba6fd130fba22a56b-us10", id:"105081", email:{email:"nazarite_paladin@yahoo.com"}}, function(data) {
	      req.session.success_flash = 'User subscribed successfully! Look for the confirmation email.';
	      res.redirect('/lists/'+req.params.id);
	    },
	    function(error) {
	      if (error.error) {
	        req.session.error_flash = error.code + ": " + error.error;
	      } else {
	        req.session.error_flash = 'There was an error subscribing that user';
	      }
	      res.redirect('/lists/'+req.params.id);
	    });
    };
});


