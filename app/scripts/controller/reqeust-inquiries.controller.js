angular.module('jwilliams').controller('ReqInqCtrl', function($scope, $http, API_URL){

	var inquiry = {
		userID: "",
		inquiryID: "String",
		message: "String",
		//When isInquiry is false it means this message is a comment.
		isInquiry: true,
		haveBeenRepledTo: false		
	};
});