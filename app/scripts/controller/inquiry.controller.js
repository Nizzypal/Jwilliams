angular.module('jwilliams').controller('InquiryCtrl', function($scope, $stateParams, InquiryDataService, UserDataService, UnitDataService){
	$scope.inquiryID = InquiryDataService.getInquiryInfo().inquiryID;

	if ($scope.inquiryID){
		//Get unit from inquiry - This is for when you come from the inquiries page
		$scope.unitID = InquiryDataService.getInquiryInfo().inquiryUnitID;
	} else {
		//Otherwise get it from its own service
		$scope.unitID = UnitDataService.getUnitInfo().unitID;
	} 

	$scope.userID = UserDataService.getUserInfo().userID;
});