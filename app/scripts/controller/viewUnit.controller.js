'use strict';



angular.module('jwilliams')
  .controller('ViewUnitCtrl', function($scope, $http, $state, API_URL, $stateParams) {
    $scope.unit = {
      name: '',
      price: '',
      photoUrl: '',
      description: '',
      serving: '',
      type: '',
      availability: '',
      dateStart: null,
      dateEnd: null
    }
    
    $http.get(API_URL + 'getUnit' + '?q=' + $stateParams.unitId).success(function(unit) {
      $scope.unit.id = unit._id;
      $scope.unit.name = unit.name; 
    }).error(function(err) {
      alert('warning', "Unable to get meals");
    })




  });
