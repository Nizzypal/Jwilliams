angular.module('jwilliams').controller('InquiryCtrl', function($scope, $stateParams, InquiryDataService){
	$scope.inquiryID = InquiryDataService.getInquiryInfo().inquiryID;
	$scope.unitID = InquiryDataService.getInquiryInfo().inquiryUnitID;
});