 'use strict';
//angular.module('jwilliams').controller('ReqInqCtrl', function($scope, $http, $state, API_URL, userIDRes){
angular.module('jwilliams').controller('ReqInqCtrl', function($scope, $http, $state, API_URL, UserDataService, UnitDataService, InquiryDataService){

	var inquiry = {
		userID: "",
		inquiryID: "String",
		message: "String",
		//When isInquiry is false it means this message is a comment.
		isInquiry: true,
		haveBeenRepledTo: false		
	};

  //get user info
  $scope.userID = UserDataService.getUserInfo().userID;

  //Set unit ID to null since we want to view all inquiries by this user
  UnitDataService.setUnitInfo({unitID: ''});

  //get user email
  $http.post(API_URL + 'userInfo' + '?q=' + $scope.userID).success(function(userInfo) {
      
      $scope.userName = userInfo.user.email;
  
  }).error(function(err) {
    alert('warning', "Unable to get userInfo");
  })    

  //get inquiries of user
  $http.get(API_URL + 'getInquiries' + '?userID=' + $scope.userID).success(function(inquiries) {

    //Log and stick to scope
    console.log('Inquiries - ' + inquiries);
    $scope.inquiries = inquiries;

    for (var i = 0; i < $scope.inquiries.length; i++){
      $scope.inquiries[i].unitName = '';

      var indexholder = i;

      //get unit of the inquiry
      UnitDataService.getUnitInfoFromDB($scope.inquiries[i].unitID)
        .then(function(data){
          $scope.inquiries[indexholder].unitName = UnitDataService.getUnitInfo().name;
          $scope.inquiries[indexholder].address =UnitDataService.getUnitInfo().address;
        }, function(err){
          alert('warning', "Unable to get unit");
          $scope.finishLoad =  false;
        });

      //Original method of getting unit info
      // $http.get(API_URL + 'getUnitB' + '?unitID=' + $scope.inquiries[i].unitID).success(function(unit) {
      //   console.log('Unit - ' + unit);
      //   $scope.inquiries[indexholder].unitName = unit[0].name;

      // }).error(function(err) {
      //   alert('warning', "Unable to get unit name");
      // });

    }

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