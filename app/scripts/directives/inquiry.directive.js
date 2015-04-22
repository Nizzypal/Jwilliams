// (function(basic) {
    'use strict';

    function EventNameInput() {
        return {
            restrict: 'AE',
            template: '<div><input="textarea"></div>',
            scope: {
            },
            controller:,
            controllerAs:,
            link: function(scope, element, attrs, controllers){
                controllers[0].init(controllers[1]);

                scope.$watch('ngModel', function(){
                    if (scope.model != scope.ngModel){
                        scope.model = scope.ngModel;
                    }
                });

                scope.$watch('model', function(){
                    scope.ngModel = scope.model;
                    
                    controllers[0].validate(scope.ngModel);
                    controllers[0].update(scope.ngModel, scope.options,
                            angular.element('.widget-text:first-child')[0].id);
                });
            }
        };
    };

    basic.directive('eventNameInput', EventNameInput);

// })(angular.module('questions.event.name.directive', [
//     'basicinfo.event.name.service'
// ]));