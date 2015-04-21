'use strict';



angular.module('jwilliams')
  .controller('ViewUnitCtrl', function($scope, $http, $state, API_URL, $stateParams) {
    $scope.details = {
      name: '',
      address: '',
      size: '',
      bedroomCount: '',
      bathroomCount: '',
      monthyRate: '',
      dailyRate: '',
      photos: []
    }

    $http.get(API_URL + 'getUnit' + '?q=' + $stateParams.unitId).success(function(unit) {
      $scope.details.name = unit.name;
      $scope.details.address = unit.address;
      $scope.details.size = unit.size;
      $scope.details.bedroomCount = unit.bedroomCount;
      $scope.details.bathroomCount = unit.bathroomCount;
      $scope.details.photos = unit.photos;
    }).error(function(err) {
      alert('warning', "Unable to get meals");
    })

    $http.get(API_URL + 'getRent' + '?q=' + $stateParams.unitId).success(function(rent) {
      $scope.details.monthyRate = rent.monthlyRate;
      $scope.details.dailyRate = rent.dailyRate;
    }).error(function(err) {
      alert('warning', "Unable to get meals");
    })




  });
