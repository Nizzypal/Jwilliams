angular.module('jwilliamsAdmin').controller('CreateUnitCtrl', function($scope, $http, API_URL){

  var pixHeight = 200;
  var pixWidth = 200;

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
  };

  $scope.unitCreate = function(){
  	alert( "Handler for .unitCreate() called." );

  	//To determine what kind of rent this is.
  	var shortTermValue = $('#cancellationFeeST').val();
  	var longTermValue = $('#cancellationFeeLT').val();
  	
  	if (parseInt(shortTermValue) > 0){
  		createUnitData.unit.forShortTerm = true;
  		createUnitData.unit.forLongTerm = false;
  	}
  	else if (parseInt(longTermValue) > 0){
  		createUnitData.unit.forLongTerm = true;
  		createUnitData.unit.forShortTerm = false;
  	}

  	$http.post(API_URL + 'createUnit', createUnitData)
  		.success(function(){})
  		.error(function(err){
  			alert('warning: ' + err.message);
  		});  
  };

	$scope.addPhoto = function(){
  		$('input#photos').click();	
	};

	$('input#photos').on('change', function(){
		var currentText = $('#photoNames').val();

		//Get names of files
		var fileObject = $('input#photos').prop("files")
		//var names = $.map(files, function(val) { return val.name; });
		var preview_elem = $("#tableEntryRow");
		
		$('#photoNames').val(currentText + "\n" + fileObject[0].name);
		var fileName = fileObject[0].name;
		var fileSize = fileObject.size;

    	if (fileSize > 200000) {
        	//angular.injector(['ng', 'skitchenApp']).invoke(function(alert) {
          	alert('warning', 'Sorry,', ' File is too big.');
        	//});
        	return;
      	}

    	var s3upload = new S3Upload({
	        s3_object_name: fileName,
	        file_dom_selector: 'photos',
	        s3_sign_put_url: '/sign_s3',
	        onProgress: function(percent, message) {
	          //status_elem.innerHTML = 'Upload progress: ' + percent + '% ' + message;
	        },
	        onFinishS3Put: function(public_url) {
	          //status_elem.innerHTML = 'Upload completed. Uploaded to: ' + public_url;
	          //url_elem.value = public_url;
	          preview_elem.append('<td><img src="' + public_url + '" style="display:table-cell;width:'+pixHeight+'px;height:'+pixWidth+'px;float:left;"/></td>');
	          unit.photos.push(public_url);
	        },
	        onError: function(status) {
	          //status_elem.innerHTML = 'Upload error: ' + status;
	        }
     	});	
	});  

	$scope.addBlockDate = function(){
     	//Blockdates
     	var currentBlockDates = $('#blockDates').val();
     	$('#blockDates').val(currentBlockDates + "\n" + $('input#blockStart').val() + ' - ' + $('input#blockEnd').val());
	};

	//Add tags
	$scope.addTags = function(){
		var currentTags = $('#tags').val();
     	$('#tags').val(currentTags + "\n" + $('input#tag').val());
     };


  $scope.reverseBoolean = function(value){
  	return !value;
  };

});