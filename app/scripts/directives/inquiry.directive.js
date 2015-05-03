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
            // scope: {
            //    textAreaRows: '@',
            //    message: '=' 
            // },
            controller: function($scope, $http, API_URL){
                var vm = this;

                var inquiryData = {
                    userID: "",
                    inquiryID: "",
                    message: "",
                    isInquiry: true,
                    haveBeenRepledTo: false
                };
                var commentData = {
                    userID: "",
                    inquiryID: "",
                    message: "",
                    isInquiry: false,
                    haveBeenRepledTo: false
                };  

                var messagesCollection = [];
                //var collectionIndex = 0;

                var textAreaRows = 4;

                //we put needed variables in the $scope
                $scope.textAreaRows = textAreaRows;
                $scope.inquiry = inquiryData;
                //$scope.comment = commentData;
                $scope.messagesCollection = messagesCollection;
                $scope.collectionIndex = 0;
                $scope.currentMessage = messagesCollection[$scope.collectionIndex];

                vm.inquiryCreate = function (inquiryData, messagesCollection){
                //function inquiryCreate (inquiryData, messagesCollection){
                    alert( "Handler for .inquiryCreate() called. inquiryData - " + inquiryData.message );

                    $http.post(API_URL + 'createInquiry', inquiryData)
                        .success(function(){})
                        .error(function(err){
                            alert('warning: ' + err.message);
                            return false;
                        });
                    
                    messagesCollection.push(inquiryData);
                    $scope.collectionIndex++;

                    //For the collection
                    var firstComment = new commentModel();
                    messagesCollection.push(firstComment);
                    $scope.currentMessage = messagesCollection[$scope.collectionIndex];
                    //$scope.collectionIndex++;

                    return true;
                };
                
                //$scope.inquiryCreate = inquiryCreate;

                vm.commentCreate = function (commentData, messagesCollection){
                //function commentCreate (commentData, messagesCollection){
                    alert( "Handler for .commentCreate() called. commentData - " + commentData.message );

                    //var tempModel = new commentModel("","",commentData);
                    //$scope.comment = tempModel;

                    $http.post(API_URL + 'createInquiry', commentData)
                        .success(function(){})
                        .error(function(err){
                            alert('warning: ' + err.message);
                            return false;
                        });
                    

                    //commentCollecton.push(commentData);
                    $scope.collectionIndex++;
                    //Since comment is a singleton, clear message field
                    //$scope.comment.message = "";

                    //For the next comment..
                    var firstComment = new commentModel();
                    messagesCollection.push(firstComment);
                    $scope.currentMessage = messagesCollection[$scope.collectionIndex];

                    //$scope.collectionIndex++;

                    return true;
                };      

                //$scope.commentCreate = commentCreate;

                function commentModel(inquiryID, userID, message){
                        this.inquiryID =  inquiryID;
                        this.userID = userID;
                        this.message = message;
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
                    alert('Inquire');
                    //if (controller.inquiryCreate(scope.inquiry, scope.messagesCollection)){
                    if (controller.inquiryCreate(inquiry, messagesCollection)){
                        $(    '<div class="row">' +
                                '<div class="spacer10"></div>' + 
                                '<div class="form-group">' +
                                    '<div class="col-md-6" style="padding-left:0px;">' +
                                        '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ng-model="messagesCollection[' + scope.collectionIndex + '].message"></textarea >' +
                                    '</div>' +
                                '</div>' +
                            '</div>'
                        ).insertBefore('div#inquireRoot div.row:last-child'); 

                        //set relevant button
                        $('button#inquire').hide();
                        $('button#comment').show();

                        //scope.$apply(function() {
                            //var html = $('<div id="inquireRoot" class="col-md-12">').append($('div#inquireRoot').clone()).html();   
                            
                            var html = $('div#inquireRoot').clone().html();   
                            var elm = $compile(html)(scope);
                            element.html('');
                            element.append(elm);    
                        //})

                        // var html = $('<div id="inquireRoot" class="col-md-12">').append($('div#inquireRoot').clone()).html();   
                        // var elm = $compile(html)(scope);
                        // element.replaceWith(elm);                    
                    }
                };

                scope.addComment = function(comment, messagesCollection){
                    alert('Comment');
                    //if (controller.commentCreate(scope.messagesCollection[scope.collectionIndex], scope.messagesCollection)){
                    if (controller.commentCreate(comment, messagesCollection)){
                        $(    '<div class="row">' +
                                '<div class="spacer10"></div>' + 
                                '<div class="form-group">' +
                                    '<div class="col-md-6" style="padding-left:0px;">' +
                                        '<textarea id="" rows="' + scope.textAreaRows + '" placeholder="Put comment here..." class="form-control input-sm" style="float:left" ng-model="messagesCollection[' + scope.collectionIndex + '].message"></textarea >' +
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
            }
        };
});
