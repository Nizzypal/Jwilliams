angular.module('jwilliams').controller('InquiryCtrl', function($scope, $stateParams, InquiryDataService, UserDataService, UnitDataService){

	var self = this;
	
	$scope.finishLoad = false;
	$scope.inquiryID = InquiryDataService.getInquiryInfo().inquiryID;
	$scope.unitDataService = UnitDataService;
	self.unitDataService = UnitDataService;

	$scope.unitDetails = UnitDataService.getUnitInfo();

	if ($scope.inquiryID){
		//Get unit from inquiry - This is for when you come from the inquiries page
		$scope.unitID = InquiryDataService.getInquiryInfo().inquiryUnitID;
		UnitDataService.getUnitInfoFromDB($scope.unitID)
			.then(function(data){
				//$scope.finishLoad = true;
				initPage(data);
			}, function(err){
				alert('warning', "Unable to get unit");
				$scope.finishLoad =  false;
			});
		// if (prepareData($scope.unitID) == true){
		// 	self.finishLoad=true;
		//}

	} else {
		//Otherwise get it from its own service
		$scope.unitID = UnitDataService.getUnitInfo().unitID;
		UnitDataService.getUnitInfoFromDB($scope.unitID)
			.then(function(data){
				$scope.finishLoad = true;
				//$state.go($state.current, {}, {reload: true});
			}, function(err){
				alert('warning', "Unable to get unit");
				$scope.finishLoad =  false;
			});		
		// if (prepareData($scope.unitID) == true){
		// 	self.finishLoad=true;
		// }
	} 

	$scope.userID = UserDataService.getUserInfo().userID;

	function initPage(data){
		$scope.finishLoad = true;
		$scope.unitDataService.isLoaded();
		self.unitDataService.isLoaded();
		$scope.unitDetails = $scope.unitDataService.getUnitInfo();
		$scope.$apply();
	}

	function prepareData(unitID){
		var bool = true;
		// UnitDataService.getUnitInfoFromDB(unitID)
		// 	.then(function(data){
		// 		return true;
		// 	}, function(err){
		// 		alert('warning', "Unable to get unit");
		// 		return false;
		// 	});
	};

	function tempCallback(){

	}
});