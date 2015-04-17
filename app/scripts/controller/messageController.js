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
		    alert('warning: ' + err.message);
		});		

	  // mc.lists.subscribe({id: 105081, email:{email:"nazarite_paladin@yahoo.com"}}, function(data) {
	  //     req.session.success_flash = 'User subscribed successfully! Look for the confirmation email.';
	  //     res.redirect('/lists/'+req.params.id);
	  //   },
	  //   function(error) {
	  //     if (error.error) {
	  //       req.session.error_flash = error.code + ": " + error.error;
	  //     } else {
	  //       req.session.error_flash = 'There was an error subscribing that user';
	  //     }
	  //     res.redirect('/lists/'+req.params.id);
	  //   });

	};
});
