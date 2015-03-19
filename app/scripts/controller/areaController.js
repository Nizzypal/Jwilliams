angular.module('jwilliams').controller('AreaCtrl', function($scope, city, API_URL, $http) {

  $scope.city = city.value;
  $scope.units = [];
  $scope.currentUnit = {};
  $http.get(API_URL + 'getItemsByCity/' + $scope.city).success(function(units) {
    console.log(units);
    $scope.units = units;
  }).error(function(err) {
    alert('warning', "Unable to get meals");
  });

  $scope.modalShown = false;
  $scope.toggleModal = function(unit) {
    $scope.currentUnit = unit;
    $scope.modalShown = !$scope.modalShown;

  };

  $scope.clicked = function(index) {
    alert(index)
  }
  $scope.$on('ngRepeatFinished', function() {
    var mySwiper = new Swiper('.swiper-container', {
      //Your options here:
      mode: 'horizontal',
      loop: false,
      keyboardControl: true,
      mousewheelControl: true,
      slidesPerView: 1,
        
     
   
    });
  });
});
