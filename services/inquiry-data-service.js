'user strict'
angular.module('jwilliams')
	.service('InquiryDataService', function(){

		var InquiryInfo = {
	        inquiryID: '',
	        inquiryUnitID: ''
	    };

        return{
            getInquiryInfo: function(){
                return InquiryInfo;
            },
            setInquiryInfo: function(value){
                InquiryInfo = value;
            }
        };

	});