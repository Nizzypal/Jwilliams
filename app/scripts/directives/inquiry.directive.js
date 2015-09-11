'use strict';

angular.module('jwilliams').directive('jwInquiry', function($compile, $state){
        return {
            restrict: 'AE',
            templateUrl: 'app/views/inquiry.tpl.html',
            replace: true,
            scope: {
               parentInquiry: '@',
               parentUnit: '@',
               userID: '@',
               ngModel: '='
            },
            controller: function($scope, $http, $stateParams, $state, API_URL, UserDataService, UnitDataService, InquiryDataService){
                var vm = this;
                var userID = UserDataService.getUserInfo().userID;
                var userName = UserDataService.getUserInfo().userName;
                var unit = UnitDataService.getUnitInfo();

                $scope.tempInnerIndex = '';

                //variables for new inquiry
                var inquiryData = {
                    userID: userID,
                    userName: userName,
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

                //Get user name to display in inquiry/comment box
                function getUserName(element, index, array){                   

                    array[index].userName = "";

                    $http.post(API_URL + 'userInfo' + '?q=' + element.userID).success(function(userInfo) {
                        
                        array[index].userName = userInfo.user.email;
                        //$scope.tempInnerIndex++;
                        $scope.tempInnerIndex = index;
                    
                    }).error(function(err) {
                      alert('warning', "Unable to get inqiury");
                    });  
                };               

                // //variable for existing user
                // if ($scope.userID){

                //    $http.get(API_URL + 'getInquiries' + '?userID=' + userID).success(function(inquiries) {
                        
                //         console.log('Inquiries - ' + inquiries);

                //         $scope.inquiries = inquiries;

                //         //get the inquiry for this unit
                //         if($scope.inquiries.length > 0){
                //             for (var i = 0; i < $scope.inquiries.length; i++){
                //                 if ($scope.inquiries[i].unitID == unit.unitID){
                //                     $scope.parentInquiry = $scope.inquiries[i];
                //                 }
                //             }

                //             $http.get(API_URL + 'getInquiries' + '?q=' + $scope.parentInquiry._id).success(function(inquiries) {
                //                 $scope.tempInnerIndex = 0;
                //                 //places the inquiries in the scope so that it can be used in the link function
                //                 $scope.readMessages = inquiries;

                //                 //Give username info to the messages
                //                 $scope.readMessages.comments.forEach(getUserName);
                            
                //             }).error(function(err) {
                //               alert('warning', "Unable to get inqiury");
                //             })                          
                //         }    

                //     }).error(function(err) {
                //       alert('warning', "Unable to get inquiries");
                //     });                

                // }

                // //variable for existing inquiry
                // if ($scope.parentInquiry){

                //     $http.get(API_URL + 'getInquiries' + '?q=' + $scope.parentInquiry + '').success(function(inquiries) {
                //         //places the inquiries in the scope so that it can be used in the link function
                //         $scope.readMessages = inquiries;

                //         //Give username info to the messages
                //         $scope.readMessages.comments.forEach(getUserName);

                //         $scope.tempInnerIndex = 0;

                //         //Set the flag which says what kind of message is being saved
                //         $scope.addingInquiry = false;                        
                    
                //     }).error(function(err) {
                //       alert('warning', "Unable to get inqiury");
                //     })                

                // }

                ////variable for unit to be inquired about
                // if ($scope.parentUnit){

                //     $http.get(API_URL + 'getUnit' + '?q=' + $scope.parentUnit).success(function(unitDetails) {
                        
                //         //places the unit details in the scope so that it can be used in the link function
                //         //$scope.unitDetails = unitDetails;
                //         $scope.unitDetails = unitDetails;
                //         $scope.unitName = unitDetails.name;
                        
                //         //Initialize the page w/ all the needed info
                //         // /pageInit();
        
                //     }).error(function(err) {
                //       alert('warning', "Unable to get unit");
                //     });              

                // }      

                //Get UNIT data 
                if ($scope.parentUnit){
                    $scope.unitDetails = UnitDataService.getUnitInfo();
                    //$scope.unitName = unitDetails.name;
                    //To resolve weird binded stuff not showing
                    $scope.unitName = $scope.unitDetails.name;                    
                }

                //Get INQUIRY data
                if ($scope.parentInquiry){
                   $scope.readMessages = InquiryDataService.Inq2();
                }

                //we put needed variables in the $scope
                $scope.textAreaRows = textAreaRows;
                $scope.userName = userName;

                $scope.inquiry = inquiryData;
                //$scope.comment = commentData;

                $scope.addingInquiry = true;
                $scope.addingComment = false;
                $scope.messagesCollection = messagesCollection;
                $scope.collectionIndex = 0;

                vm.inquiryCreate = function (inquiryData, messagesCollection){

                    //Fill the inquiry object with relevant information
                    if ($scope.unitDetails){
                        //For the case where you came from a pre selected inquiry
                        inquiryData.unitID = $scope.unitDetails._id;
                    } else {
                        //When you're creating an inquiry
                        inquiryData.message = inqiury.message;
                    }

                    //Get unit info from service
                    //inquiryData.unitID = unit;
                    
                    //Get date for inquiry
                    inquiryData.dateOfInquiry = new Date().toUTCString();
                    inquiryData.userID = userID;
                    inquiryData.isInquiry = true; 

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

                    //Set the flag which says what kind of message is being saved
                    $scope.addingInquiry = false;
                    $scope.addingComment = true;

                    return true;
                };
                
                //$scope.inquiryCreate = inquiryCreate;

                vm.commentCreate = function (commentData, messagesCollection){

                    //Adjust index So that the next area can be bound properly
                    $scope.collectionIndex++;

                    messagesCollection.push(commentData);

                    //Determine if inquiry is read or made
                    var inquiryIDToBeUsed
                    if (inquiryID != null){
                        inquiryIDToBeUsed = inquiryID;
                    } else {
                        inquiryIDToBeUsed = messagesCollection[0].id;
                    }

                    //For some reason the messagesCollection is updated automatically so NO need to push
                    var nextComment = new commentModel(inquiryIDToBeUsed, userID, userName, $scope.unitDetails._id,
                        messagesCollection[$scope.collectionIndex].message);
                    
                    //Place the new comment in the collection
                    messagesCollection[$scope.collectionIndex] = nextComment;
                    //$scope.currentMessage = messagesCollection[$scope.collectionIndex];


                    $http.post(API_URL + 'createInquiry', nextComment)
                        .success(function(){})
                        .error(function(err){
                            alert('warning: ' + err.message);
                            return false;
                        });

                    return true;
                };      

                //Instatiates comment object
                function commentModel(inquiryID, userID, userName, id, message){
                    this.inquiryID =  inquiryID;
                    this.userID = userID;
                    this.userName = userName;
                    this.unitID = id;
                    this.message = message;
                    this.dateOfInquiry = new Date().toUTCString();
                    this.isInquiry = false;
                    this.haveBeenRepledTo = false;       
                };     

                // $scope.$watch(function(){
                //     return $scope.ngModel;
                // }, function(newval, oldval){

                //     $scope.unitName = $scope.ngModel.unitDetails.unitName;
                //     $scope.unitDetails = $scope.ngModel.unitDetails;

                //     $scope.readMessages = $scope.ngModel.inquiryDetails;
                //     $scope.tempInnerIndex = 0;
                //     //Set the flag which says what kind of message is being saved
                //     //$scope.addingInquiry = false;                      

                //     $scope.$apply();
                //     $state.go($state.current, {}, {reload: true});
                // }, true);                 
            },
            link: function(scope, element, attrs, controller, UnitDataService){

                var origHTML = $('div#inquireRoot').children().clone();

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
                                        '<p>By: {{messagesCollection[' + (scope.collectionIndex+1) + '].userName}}</p>' +
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
                                        //'<p>By: {{messagesCollection[' + (scope.collectionIndex+1) + '].userName}}</p>' +
                                        '<p>By: {{messagesCollection[' + (scope.collectionIndex) + '].userName}}</p>' +
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
                //scope.$watch('readMessages.comments', initialize, true);   
                //scope.$watch('tempInnerIndex', initialize, true);   
                scope.$watch(function(){
                    //return scope.tempInnerIndex;
                    return scope.addingInquiry;
                }, initialize, true);   

                scope.$watch(function(){
                    return scope.ngModel;
                }, function(newval, oldval){

                    if (scope.ngModel.unitDetails){
                        scope.unitName = scope.ngModel.unitDetails.unitName;
                        scope.unitDetails = scope.ngModel.unitDetails;
                    }
                    if (scope.ngModel.inquiryDetails){
                        scope.readMessages = scope.ngModel.inquiryDetails;
                        scope.tempInnerIndex = 0;
                        scope.collectionIndex = 0;
                        //?
                        scope.messagesCollection = [];
                        initialize();
                    }

                    //Set the flag which says what kind of message is being saved
                    //scope.addingInquiry = false;                      
                }, true);                


                //Function used for initialization of pre-loaded inquiry/comments
                function initialize(){
                    
                    //Place inquiry - involves changing its model but since this is always called, checks first if there is a preloaded inquiry
                    if (!(scope.readMessages == null)) {
                      $('textarea#inquire').attr('ng-model', 'readMessages.baseInquiry.message');  
                        
                        //set relevant button
                        $('button#inquire').hide();
                        $('button#comment').show();

                        //Update messagesCollection and relevant iterator
                        scope.messagesCollection.push(scope.readMessages.baseInquiry);

                    }

                    //Place comments of that inquiry
                    if (scope.readMessages){

                        //Reset rootElement
                        element.html('');
                        element.append(origHTML);

                        if (scope.readMessages.comments.length > 0){

                            scope.readMessages.comments.forEach(function(e, i, a){
                                $(  '<div class="row">' +
                                        '<div class="spacer10"></div>' + 
                                        '<div class="form-group">' +
                                            '<div class="col-md-6" style="padding-left:0px;">' +
                                                '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ' + 
                                                'value="' + e.message + '" ng-model="readMessages.comments[' + (i) + '].message"></textarea >' +
                                                '<p>By: ' + scope.readMessages.comments[scope.tempInnerIndex].userName + '</p>' +
                                                //'<p>By: ' + scope.userName + '</p>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>'
                                ).insertBefore('div#inquireRoot div.row:last-child'); 

                                //Update messagesCollection and relevant iterator
                                scope.messagesCollection.push(scope.readMessages.comments[scope.tempInnerIndex]);
                                scope.collectionIndex++;                           

                                //Update innerIndex first
                                scope.tempInnerIndex++;                                                              
                            });

                            // Add last blank comment box
                            $(    '<div class="row">' +
                                    '<div class="spacer10"></div>' + 
                                    '<div class="form-group">' +
                                        '<div class="col-md-6" style="padding-left:0px;">' +
                                            '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ' + 
                                            'value="" ng-model="messagesCollection[' + (scope.collectionIndex+1) + '].message"></textarea >' +
                                            '<p>By: ' + scope.userName + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'
                            ).insertBefore('div#inquireRoot div.row:last-child');  

                        } else {
                            //For the instance that there is an inquiry but no comments
                            $(    '<div class="row">' +
                                    '<div class="spacer10"></div>' + 
                                    '<div class="form-group">' +
                                        '<div class="col-md-6" style="padding-left:0px;">' +
                                            '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ' + 
                                            'value="" ng-model="messagesCollection[' + (scope.collectionIndex+1) + '].message"></textarea >' +
                                            '<p>By: ' + scope.userName + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'
                            ).insertBefore('div#inquireRoot div.row:last-child');   
                        }

                    } else {                 
                    }

                    var html = $('div#inquireRoot').clone().html();   
                    var newElement = $compile(html)(scope);

                    element.html('');
                    //element.empty();
                    element.append(newElement); 
                      
                  

                    // //Place comments of that inquiry
                    // scope.readMessages.comments.forEach(function(e, i, a){
                    //     $(    '<div class="row">' +
                    //             '<div class="spacer10"></div>' + 
                    //             '<div class="form-group">' +
                    //                 '<div class="col-md-6" style="padding-left:0px;">' +
                    //                     '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ' + 
                    //                     'value="' + e.message + '" ng-model="readMessages.comments[' + (i) + '].message"></textarea >' +
                    //                     '<p>By: ' + scope.readMessages.comments[scope.tempInnerIndex].userName + '</p>' +
                    //                 '</div>' +
                    //             '</div>' +
                    //         '</div>'
                    //     ).insertBefore('div#inquireRoot div.row:last-child'); 

                    //     var html = $('div#inquireRoot').clone().html();   
                    //     var newElement = $compile(html)(scope);
                    //     element.html('');
                    //     element.append(newElement);                                
                    // });

                };                     
            }
        };
});
