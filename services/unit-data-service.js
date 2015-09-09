'user strict'
angular.module('jwilliams')
	.service('UnitDataService', function($http, $q, API_URL){

		var UnitInfo = {
	        unitID: '',
	        unitName: ''
	    };

        var self = this;
        self.isLoaded = false;

        return{
            isLoaded: function(){
                return self.isLoaded;
            },

            getUnitInfo: function(){
                return UnitInfo;
            },
            
            setUnitInfo: function(value){
                UnitInfo = value;
            },

            getUnitInfoFromDB: function(parentUnit){
                var deferred = $q.defer();

                $http.get(API_URL + 'getUnit' + '?q=' + parentUnit).success(function(unitDetails) {
                    
                    UnitInfo.unitName = unitDetails.name;
                    UnitInfo.unitType = unitDetails.type;
                    UnitInfo.unitFloor = unitDetails.floor;
                    UnitInfo.unitFloorCount = unitDetails.floorCount;
                    UnitInfo.unitPrice = unitDetails.price;
                    UnitInfo.unitSize = unitDetails.size;
                    UnitInfo.unitBedRoomCount = unitDetails.bedroomCount;
                    UnitInfo.unitBathRoomCount = unitDetails.bathroomCount;
                    UnitInfo.unitQuartersCount = unitDetails.quartersCount;
                    UnitInfo.unitPowderCount = unitDetails.powderCount;
                    UnitInfo.unitShorTerm = unitDetails.forShortTerm;
                    UnitInfo.unitLonTerm = unitDetails.forLongTerm;
                    UnitInfo.unitSale = unitDetails.forSale;
                    UnitInfo.unitCondoName = unitDetails.condominiumName;
                    UnitInfo.unitCity = unitDetails.city;
                    UnitInfo.unitAddress = unitDetails.address;
                    UnitInfo.unitPhotos = unitDetails.photos;

                    self.isLoaded = true;

                    deferred.resolve();
    
                }).error(function(err) {
                    alert('warning', "Unable to get unit");
                    return false;
                }); 

                return deferred.promise;                               
            }
        };

	});