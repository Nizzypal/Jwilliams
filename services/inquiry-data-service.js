'user strict'
angular.module('jwilliams')
	.service('InquiryDataService', function(){

		var InquiryInfo = {
	        inquiryID: '',
	        inquiryName: ''
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