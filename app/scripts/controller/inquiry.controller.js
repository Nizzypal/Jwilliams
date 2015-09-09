angular.module('jwilliams').controller('InquiryCtrl', function($scope, $stateParams, InquiryDataService, UserDataService, UnitDataService){

	var self = this;
	self.finishLoad = false;

	$scope.inquiryID = InquiryDataService.getInquiryInfo().inquiryID;



	if ($scope.inquiryID){
		//Get unit from inquiry - This is for when you come from the inquiries page
		$scope.unitID = InquiryDataService.getInquiryInfo().inquiryUnitID;
		if (prepareData($scope.unitID) == true){
			self.finishLoad=true;
		}

	} else {
		//Otherwise get it from its own service
		$scope.unitID = UnitDataService.getUnitInfo().unitID;
		if (prepareData($scope.unitID) == true){
			self.finishLoad=true;
		}
	} 

	$scope.userID = UserDataService.getUserInfo().userID;

	function prepareData(unitID){
		var bool = true;
		UnitDataService.getUnitInfoFromDB(unitID)
			.then(function(data){
				return true;
			}, function(err){
				alert('warning', "Unable to get unit");
				return false;
			});
	};
});