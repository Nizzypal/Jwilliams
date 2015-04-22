// (function(basic) {
    'use strict';

    function Inquiry($scope) {
        return {
            restrict: 'AE',
            template:   '<input id="inquiry" type="textarea" style="float:right"></input>' + 
                        '<button id="inquire" class="btn-primary" ng-click="addInquiry()">Submit</button>' +
                        '<input id="" type="textarea comment" style="float:right"></input>' + 
                        '<button id="comment" class="btn-primary" ng-click="addComment()">Comment</button>',
            scope: {
            },
            controller: function(){
                var vm = this;
                vm.addInquiry = addInquiry;
                vm.addComment = addComment;

                function addInquiry(){
                    //TODO save inquiry
                };
                function addComment(){
                    //TODO save comment
                };
            },
            link: function(scope, element, attrs, controller){
                $scope.addInquiry = function(){
                    controller.addInquiry();
                    $('input#inquiry:last').append('<input id="" type="textarea" style="float:right"></input>' + 
                        '<button id="comment" class="btn-default" ng-click="addComment()">Comment</button>');
                };
                $scope.addComment = function(){
                    $('input.comment:last').append('<input id="" type="textarea" style="float:right"></input>' + 
                        '<button id="comment" class="btn-primary" ng-click="addComment()">Comment</button>');
                };
            }
        };
    };

    angular.module('jwilliams').directive('jwInquiry', Inquiry);

// })(angular.module('questions.event.name.directive', [
//     'basicinfo.event.name.service'
// ]));