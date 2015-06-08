 'use strict';
//angular.module('jwilliams').controller('ReqInqCtrl', function($scope, $http, $state, API_URL, userIDRes){
angular.module('jwilliams').controller('ReqInqCtrl', function($scope, $http, $state, API_URL, UserDataService, InquiryDataService){

	var inquiry = {
		userID: "",
		inquiryID: "String",
		message: "String",
		//When isInquiry is false it means this message is a comment.
		isInquiry: true,
		haveBeenRepledTo: false		
	};

  $scope.userID = UserDataService.getUserInfo().userID;

  $http.post(API_URL + 'userInfo' + '?q=' + $scope.userID).success(function(userInfo) {
      
      $scope.userName = userInfo.user.email;
  
  }).error(function(err) {
    alert('warning', "Unable to get userInfo");
  })    

  $http.get(API_URL + 'getInquiries' + '?userID=' + $scope.userID).success(function(inquiries) {
    
    console.log('Inquiries - ' + inquiries);

    $scope.inquiries = inquiries;
  }).error(function(err) {
    alert('warning', "Unable to get inquiries");
  });


  $scope.goInquire = function(inquiry) {
  //alert("Go inquire w/ id - " + inquiry._id);

    InquiryDataService.setInquiryInfo({inquiryID: inquiry._id,
      inquiryUnitID: inquiry.unitID});

    $state.go("inquiry");//,  {
    //   "inquiryID": inquiry._id,
    //   "unitID": inquiry.unitID
    // });  	    
  };

});