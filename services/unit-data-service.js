'user strict'
angular.module('jwilliams')
	.service('UnitDataService', function(){

		var UnitInfo = {
	        unitID: '',
	        unitName: ''
	    };

        return{
            getUnitInfo: function(){
                return UnitInfo;
            },
            setUnitInfo: function(value){
                UnitInfo = value;
            }
        };

	});