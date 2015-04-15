angular.module('jwilliamsAdmin').controller('CreateUnitCtrl', function($scope, $http, API_URL){

  var unit = {
		name: "",
		type: "",
		floor: "",
		floorCount: "",
		price: "",
		size: "",
		bedroomCount: "",
		bathroomCount: "",
		quartersCount: "",
		powderCount: "",
		forShortTerm: false,
		forLongTerm: false,
		forSale: true,
		condominiumName: "",
		city: "",
		address: "",
		photos: []
  };
  //get reference of variable to scope to bind it
  $scope.unit = unit;

  var rentInfo = {
		monthlyRate: 0,
		dailyRate: 0,
		blockDateStart: "",
		blockDateEnd: "",
		blockDates: [],
		currentRenter: "",
		numberMonthsAdvance: 0,
		numberMonthsDeposit: 0,
		cancellationFeeLT: 0,
		cancellationFeeST: 0,
		terminationFee: 0,
		includeUtilities: false,
		includeInternet: false,
		requirePassport: false,
		requireAlienCard: false,
		requireID: false,
		unitAmenities: [],
		buildingAmenities: []
  };
  //get reference of variable to scope to bind it
  $scope.rentInfo = rentInfo;

  var createUnitData = {
  	unit: unit,
  	rentInfo: rentInfo
  }
  $scope.unitCreate = function(){
  	alert( "Handler for .unitCreate() called." );

  	$http.post(API_URL + 'createUnit', createUnitData)
  		.success(function(){})
  		.error(function(err){
  			alert('warning: ' + err.message);
  		});
  };

})