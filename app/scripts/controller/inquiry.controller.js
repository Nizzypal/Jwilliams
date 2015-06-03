angular.module('jwilliams').controller('InquiryCtrl', function($scope, $stateParams, UnitDataService, InquiryDataService){
	$scope.inquiryID = InquiryDataService.getInquiryInfo().inquiryID;
	$scope.unitID = UnitDataService.getUnitInfo().unitID;
});