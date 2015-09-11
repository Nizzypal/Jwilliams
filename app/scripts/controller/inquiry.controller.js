angular.module('jwilliams').controller('InquiryCtrl', function($scope, $stateParams, InquiryDataService, UserDataService, UnitDataService){

	var self = this;
	
	$scope.finishLoad = false;
	$scope.inquiryID = InquiryDataService.getInquiryInfo().inquiryID;
	
	$scope.unitDataService = UnitDataService;
	$scope.inquiryDataService = InquiryDataService;

	self.unitDataService = UnitDataService;
	//self.inquiryDataService = inquiryDataService;

	$scope.unitDetails = {};
	$scope.inquiryDetails = {};
	$scope.dataModel = {};

	if ($scope.inquiryID){
		
		//Get unit from inquiry - This is for when you come from the inquiries page
		$scope.unitID = InquiryDataService.getInquiryInfo().inquiryUnitID;
		UnitDataService.getUnitInfoFromDB($scope.unitID)
			.then(function(data){
				initPage(data);
			}, function(err){
				alert('warning', "Unable to get unit");
				$scope.finishLoad =  false;
			});

		InquiryDataService.getInquiryInfoFromDB($scope.inquiryID)
			.then(function(data){
				initPage(data);
			},function(err){
				alert('warning', "Unable to get inquiry");
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
	} 

	$scope.userID = UserDataService.getUserInfo().userID;

	function initPage(data){
		$scope.finishLoad = true;
		$scope.unitDataService.isLoaded();
		self.unitDataService.isLoaded();

		//Get latest data from services
		$scope.unitDetails = $scope.unitDataService.getUnitInfo();
		$scope.inquiryDetails = $scope.inquiryDataService.Inq2();
		$scope.dataModel.unitDetails = $scope.unitDetails;
		$scope.dataModel.inquiryDetails = $scope.inquiryDetails;
		
		//$scope.$apply();
	}

	// function prepareData(unitID){
	// 	var bool = true;
	// 	// UnitDataService.getUnitInfoFromDB(unitID)
	// 	// 	.then(function(data){
	// 	// 		return true;
	// 	// 	}, function(err){
	// 	// 		alert('warning', "Unable to get unit");
	// 	// 		return false;
	// 	// 	});
	// };

	function tempCallback(){

	}
});