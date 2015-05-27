// 'use strict';
angular.module('jwilliams').controller('ReqInqCtrl', function($scope, $http, $state, API_URL, userIDRes){

	var inquiry = {
		userID: "",
		inquiryID: "String",
		message: "String",
		//When isInquiry is false it means this message is a comment.
		isInquiry: true,
		haveBeenRepledTo: false		
	};

    $http.get(API_URL + 'getInquiries' + '?userID=' + userIDRes.value).success(function(inquiries) {
      
      console.log('Inquiries - ' + inquiries);

      $scope.inquiries = inquiries;
    }).error(function(err) {
      alert('warning', "Unable to get inquiries");
    });


    $scope.goInquire = function(inquiry) {
    	//alert("Go inquire w/ id - " + inquiry._id);

	    $state.go("inquiry",  {
        "inquiryID": inquiry._id,
        "unitID": inquiry.unitID
      });  	    
	};
});