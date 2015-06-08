angular.module('jwilliams').controller('AreaCtrl', function($scope,$state, $http, city, API_URL, UserDataService) {

  //Get City info
  $scope.city = city.value;
  $scope.units = [];
  $scope.currentUnit = {};

  //Get user info
  $scope.userID = UserDataService.getUserInfo().userID;

  $http.get(API_URL + 'getItemsByCity/' + $scope.city).success(function(units) {
    console.log(units);
    $scope.units = units;
  }).error(function(err) {
    alert('warning', "Unable to get units");
  });

  $scope.modalShown = false;
  $scope.toggleModal = function(unit) {
    $scope.currentUnit = unit;
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.clicked = function(index) {
    alert(index)
  };

  $scope.$on('ngRepeatFinished', function(event, data) {
    // var mySwiper = new Swiper('.swiper-container', {
      //Your options here:
      // mode: 'horizontal',
      // loop: false,
     // keyboardControl: true,
     // mousewheelControl: true,
     //  slidesPerView: 3,
     //  scrollbar: '.swiper-scrollbar',
     //  scrollbarHide: false,
     //  centeredSlides: true,
     //  spaceBetween: 30,
     //  grabCursor: true,
     //  nextButton: '.swiper-button-next',
     //  prevButton: '.swiper-button-prev'
      
    // });

    // mySwiper.update(true);
  });

  $scope.goView = function(unit) {
    alert('go');
    $state.go("viewUnit", {"unitID": unit._id});
  };
});
