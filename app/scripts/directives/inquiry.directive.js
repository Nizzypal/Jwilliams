'use strict';

angular.module('jwilliams').directive('jwInquiry', function($compile){
        return {
            restrict: 'AE',
            templateUrl: 'app/views/inquiry.tpl.html',
            replace: true,
            scope: {
               parentInquiry: '@',
               parentUnit: '@'
            },
            controller: function($scope, $http, $stateParams, API_URL){
                var vm = this;

                //variables for new inquiry
                var inquiryData = {
                    userID: $stateParams.userID,
                    inquiryID: "",
                    unitID: "",
                    message: "",
                    dateOfInquiry: "",
                    isInquiry: true,
                    haveBeenRepledTo: false
                };

                var inquiryID = null;
                var messagesCollection = [];
                var textAreaRows = 4;

                var userID = $stateParams.userID;
                //var readMessages = {};

                //variable for existing inquiry
                if ($scope.parentInquiry){

                    $http.get(API_URL + 'getInquiries' + '?q=' + $scope.parentInquiry).success(function(inquiries) {
                        
                        //places the inquiries in the scope so that it can be used in the link function
                        $scope.readMessages = inquiries;
                    
                    }).error(function(err) {
                      alert('warning', "Unable to get inqiury");
                    })                

                }

                //variable for unit to be inquired about
                if ($scope.parentUnit){

                    $http.get(API_URL + 'getUnit' + '?q=' + $scope.parentUnit).success(function(unitDetails) {
                        
                        //places the unit details in the scope so that it can be used in the link function
                        $scope.unitDetails = unitDetails;

                    }).error(function(err) {
                      alert('warning', "Unable to get unit");
                    })                

                }                

                //we put needed variables in the $scope
                $scope.textAreaRows = textAreaRows;
                $scope.inquiry = inquiryData;
                //$scope.comment = commentData;
                $scope.messagesCollection = messagesCollection;
                $scope.collectionIndex = 0;
                $scope.currentMessage = messagesCollection[$scope.collectionIndex];
                // $scope.readMessages = {
                //     baseInquiry: {},
                //     comments: []
                // };

                vm.inquiryCreate = function (inquiryData, messagesCollection){

                    //Fill the inquiry object with relevant information
                    inquiryData.dateOfInquiry = new Date().toUTCString();
                    inquiryData.unitID = $scope.unitDetails._id;

                    $http.post(API_URL + 'createInquiry', inquiryData)
                        .success(function(newInquiry){
                            inquiryID = newInquiry.newInquiryID;

                            //put the inquiry in the collection
                            messagesCollection.push(inquiryData);
                            //$scope.collectionIndex++;

                            //For the comment to follow which still has NO message
                            // var firstComment = new commentModel(inquiryID, "111", "");
                            // messagesCollection.push(firstComment);
                            // $scope.currentMessage = messagesCollection[$scope.collectionIndex];

                        })
                        .error(function(err){
                            alert('warning: ' + err.message);
                            return false;
                        });
                    
                    //Setup the first comment
                    //$scope.collectionIndex++;
                    //$scope.currentMessage = messagesCollection[$scope.collectionIndex];

                    return true;
                };
                
                //$scope.inquiryCreate = inquiryCreate;

                vm.commentCreate = function (commentData, messagesCollection){

                     //Adjust index So that the next area can be bound properly
                    $scope.collectionIndex++;

                    //For some reason the messagesCollection is updated automatically so NO need to push
                    var nextComment = new commentModel(inquiryID, userID, $scope.unitDetails._id,messagesCollection[$scope.collectionIndex].message);
                    //messagesCollection.push(nextComment);
                    $scope.currentMessage = messagesCollection[$scope.collectionIndex];


                    $http.post(API_URL + 'createInquiry', nextComment)
                        .success(function(){})
                        .error(function(err){
                            alert('warning: ' + err.message);
                            return false;
                        });

                    return true;
                };      

                //Instatiates comment object
                function commentModel(inquiryID, userID, id, message){
                    this.inquiryID =  inquiryID;
                    this.userID = userID;
                    this.unitID = id;
                    this.message = message;
                    this.dateOfInquiry = new Date().toUTCString();
                    this.isInquiry = false;
                    this.haveBeenRepledTo = false;       
                };      
            },
            link: function(scope, element, attrs, controller){

                if (scope.messagesCollection.length > 0){
                    $('button#inquire').hide();
                    $('button#comment').show();
                } else {
                    $('button#inquire').show();
                    $('button#comment').hide();                    
                }

                scope.addInquiry = function(inquiry, messagesCollection){
                    //if (controller.inquiryCreate(scope.inquiry, scope.messagesCollection)){
                    if (controller.inquiryCreate(inquiry, messagesCollection)){
                        $(    '<div class="row">' +
                                '<div class="spacer10"></div>' + 
                                '<div class="form-group">' +
                                    '<div class="col-md-6" style="padding-left:0px;">' +
                                        '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ng-model="messagesCollection[' + (scope.collectionIndex+1) + '].message"></textarea >' +
                                        //'<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ng-model="messagesCollection[1].message"></textarea >' +
                                        '<p>By: {{messagesCollection[' + (scope.collectionIndex+1) + '].userID}}</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                        ).insertBefore('div#inquireRoot div.row:last-child'); 

                        //set relevant button
                        $('button#inquire').hide();
                        $('button#comment').show();

                        var html = $('div#inquireRoot').clone().html();   
                        var elm = $compile(html)(scope);
                        element.html('');
                        element.append(elm);    
                    }
                };

                scope.addComment = function(comment, messagesCollection){
                    //if (controller.commentCreate(scope.messagesCollection[scope.collectionIndex], scope.messagesCollection)){
                    if (controller.commentCreate(comment, messagesCollection)){
                        $(    '<div class="row">' +
                                '<div class="spacer10"></div>' + 
                                '<div class="form-group">' +
                                    '<div class="col-md-6" style="padding-left:0px;">' +
                                        '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ng-model="messagesCollection[' + (scope.collectionIndex+1) + '].message"></textarea >' +
                                        '<p>By: {{messagesCollection[' + (scope.collectionIndex+1) + '].userID}}</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                        ).insertBefore('div#inquireRoot div.row:last-child'); 

                        var html = $('div#inquireRoot').clone().html();   
                        var elm = $compile(html)(scope);
                        element.html('');
                        element.append(elm);                   
                    }
                };

                //Places the inquiries/comments in the UI
                scope.$watch('readMessages', initialize);                        

                //Function used for initialization of pre-loaded inquiry/comments
                function initialize(){
                    
                    //Place inquiry - involves changing its model but since this is always called, checks first if there is a preloaded inquiry
                    if (!(scope.readMessages == null)) {
                      $('textarea#inquire').attr('ng-model', 'readMessages.baseInquiry.message');  
                    }

                    //Place comments of that inquiry
                    scope.readMessages.comments.forEach(function(e, i, a){
                        $(    '<div class="row">' +
                                '<div class="spacer10"></div>' + 
                                '<div class="form-group">' +
                                    '<div class="col-md-6" style="padding-left:0px;">' +
                                        '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ' + 
                                        'value="' + e.message + '" ng-model="readMessages.comments[' + (i) + '].message"></textarea >' +
                                        '<p>By: ' + scope.readMessages.comments[i].userID + '</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                        ).insertBefore('div#inquireRoot div.row:last-child'); 

                        var html = $('div#inquireRoot').clone().html();   
                        var newElement = $compile(html)(scope);
                        element.html('');
                        element.append(newElement);                                
                    });

                };                     
            }
        };
});
