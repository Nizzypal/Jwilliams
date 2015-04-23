'use strict';

angular.module('jwilliams').directive('jwInquiry', function(){
        return {
            restrict: 'AE',
            template:   '<div id="inquireRoot" class="col-md-12">' +
                            '<div class="row">' +
                                '<div class="spacer10"></div>' + 
                                '<div class="form-group">' +
                                    '<div class="col-md-6" style="padding-left:0px;">' +
                                        '<textarea id="inquire" rows="5" placeholder="Put inquiry here..." class="form-control input-sm" style="float:left"></textarea >' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div class="spacer20"></div>' + 
                                '<div class="form-group">' +
                                    '<button id="inquire" class="btn-primary" class="col-md-6" style="float:left" ng-click="addInquiry()">Submit</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>',
            replace: true,
            controller: function(){
                var vm = this;
                vm.addInquiry = function addInquiry(){
                    //TODO save inquiry
                };
                vm.addComment = function addComment(){
                    //TODO save comment
                };
            },
            link: function(scope, element, attrs, controller){
                scope.addInquiry = function(){
                    alert('Inquire');
                    controller.addInquiry();
                    $(    '<div class="row">' +
                            '<div class="spacer10"></div>' + 
                            '<div class="form-group">' +
                                '<div class="col-md-6" style="padding-left:0px;">' +
                                    '<textarea id="" rows="5" placeholder="Put comment here..." class="form-control input-sm" style="float:left"></textarea >' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    ).insertBefore('div#inquireRoot div.row:last-child');
                };

                scope.addComment = function(){
                    alert('Comment');
                    controller.addComment();
                    // $('input.comment:last-child').append('<input id="" type="textarea" style="float:right"></input>' + 
                    //     '<button id="comment" class="btn-primary" ng-click="addComment()">Comment</button>');
                };
            }
        };
});
