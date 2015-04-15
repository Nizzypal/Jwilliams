angular.module('jwilliams').controller('MessageCtrl', function($scope, $http, API_URL){
	var message = {
		name: "",
		date: "",
		message: "",
		replied: false
	};

	$scope.message = message;
	$scope.sendMessage = function(){
		alert( "Handler for .sendMessage() called." );

		//get messages's date of posting
		message.date = Date().toString();

		$http.post(API_URL + 'sendMessage', message).success(function() {
		}).error(function(err) {
		    alert('warning', "Unable to send message!");
		});				
	};
});
