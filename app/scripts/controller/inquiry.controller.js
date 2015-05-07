angular.module('jwilliams').controller('InquiryCtrl', function($scope, $stateParams){
	$scope.inquiryID = $stateParams.inquiryID;
	$scope.unitID = $stateParams.unitID;
});