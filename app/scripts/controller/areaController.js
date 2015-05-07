angular.module('jwilliams').controller('AreaCtrl', function($scope,$state, city, API_URL, $http) {

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
  $scope.$on('ngRepeatFinished', function(event, data) {
    var mySwiper = new Swiper('.swiper-container', {
      //Your options here:
      mode: 'horizontal',
      loop: false,
//      keyboardControl: true,
//      mousewheelControl: true,
      slidesPerView: 3,
      scrollbar: '.swiper-scrollbar',
      scrollbarHide: false,
      centeredSlides: true,
      spaceBetween: 30,
      grabCursor: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev'



    });
  });

  $scope.goView = function(unit) {
    $state.go("viewUnit", {
      "unitId": unit._id
    });
  };
});
