'user strict'
angular.module('jwilliams')
	.service('InquiryDataService', function($http, $q, API_URL){

		var InquiryInfo = {
	        inquiryID: '',
	        inquiryUnitID: ''
	    };

        var self = this;
        self.Inq2 = {};

        var Comments = [];

        //
        function getUserName(element, index, array){                   

            array[index].userName = "";

            $http.post(API_URL + 'userInfo' + '?q=' + element.userID).success(function(userInfo) {
                
                array[index].userName = userInfo.user.email;
                //$scope.tempInnerIndex++;
                //$scope.tempInnerIndex = index;
            
            }).error(function(err) {
              alert('warning', "Unable to get inqiury");
            });  
        };  

        return{
            Inq2: function() {
                return self.Inq2;
            },

            getInquiryInfo: function(){
                return InquiryInfo;
            },
            setInquiryInfo: function(value){
                InquiryInfo = value;
            },

            getInquiryInfoFromDB: function(parentInquiry){
                var deferred = $q.defer();

                $http.get(API_URL + 'getInquiries' + '?q=' + parentInquiry + '').success(function(inquiry) {
                    //places the inquiries in the scope so that it can be used in the link function
                    self.Inq2 = inquiry;

                    //Give username info to the messages
                    self.Inq2.comments.forEach(getUserName);

                    //$scope.tempInnerIndex = 0;

                    ////Set the flag which says what kind of message is being saved
                    //$scope.addingInquiry = false;            

                    deferred.resolve("inquiry");            
                
                }).error(function(err) {
                  alert('warning', "Unable to get inqiury");
                })  

                return deferred.promise;
            }

        };

	});