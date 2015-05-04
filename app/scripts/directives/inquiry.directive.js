'use strict';

angular.module('jwilliams').directive('jwInquiry', function($compile){
        return {
            restrict: 'AE',
            template:   '<div id="inquireRoot" class="col-md-12">' +
                            '<div class="row">' +
                                '<div class="spacer10"></div>' + 
                                '<div class="form-group">' +
                                    '<div class="col-md-6" style="padding-left:0px;">' +
                                        '<textarea id="inquire" rows="{{textAreaRows}}" placeholder="Put inquiry here..." class="form-control input-sm" style="float:left;" ng-model="inquiry.message"></textarea>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="spacer20"></div>' + 
                                '<div class="form-group">' +
                                    '<button id="inquire" class="btn-primary" class="col-md-6" style="float:left" ng-click="addInquiry(inquiry, messagesCollection)">Submit</button>' +
                                    '<button id="comment" class="btn-primary" class="col-md-6" style="float:left" ng-click="addComment(currentMessage, messagesCollection)">Comment</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>',
            replace: true,
            scope: {
               parentInquiry: '@'
            },
            controller: function($scope, $http, API_URL){
                var vm = this;

                //variables for new inquiry
                var inquiryData = {
                    userID: "111",
                    inquiryID: "",
                    message: "",
                    dateOfInquiry: "",
                    isInquiry: true,
                    haveBeenRepledTo: false
                };
                // var commentData = {
                //     userID: "111",
                //     inquiryID: "",
                //     message: "",
                //     isInquiry: false,
                //     haveBeenRepledTo: false
                // };  

                var inquiryID = null;
                var messagesCollection = [];
                var textAreaRows = 4;
                //var readMessages = {};

                //variable for existing inquiry
                if ($scope.parentInquiry){

                    $http.get(API_URL + 'getInquiries' + '?q=' + $scope.parentInquiry).success(function(inquiries) {
                        
                        //places the inquiries in the scope so that it can be used in the link function
                        $scope.readMessages = inquiries;
                    
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

                    //Timestamp when inquiry was created
                    inquiryData.dateOfInquiry = new Date().toUTCString();

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
                    var nextComment = new commentModel(inquiryID,"111",messagesCollection[$scope.collectionIndex].message);
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
                function commentModel(inquiryID, userID, message){
                    this.inquiryID =  inquiryID;
                    this.userID = userID;
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
                    if (scope.readMessages == {}) $('textarea#inquire').attr('ng-model', 'readMessages.baseInquiry.message');

                    //Place comments of that inquiry
                    scope.readMessages.comments.forEach(function(e, i, a){
                        $(    '<div class="row">' +
                                '<div class="spacer10"></div>' + 
                                '<div class="form-group">' +
                                    '<div class="col-md-6" style="padding-left:0px;">' +
                                        '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ' + 
                                        'value="' + e.message + '" ng-model="readMessages.comments[' + (i) + '].message"></textarea >' +
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
