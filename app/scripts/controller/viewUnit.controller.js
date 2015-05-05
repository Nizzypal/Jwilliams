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
      alert('warning', "Unable to get unit");
    })

    $http.get(API_URL + 'getRent' + '?q=' + $stateParams.unitId).success(function(rent) {
      $scope.details.monthlyRate = rent.monthlyRate;
      $scope.details.dailyRate = rent.dailyRate;
    }).error(function(err) {
      alert('warning', "Unable to get rent");
    })

    $scope.goInquire = function(unit) {
      //$state.go("inquiry");
      $state.go("inquiry", {
        //"userID": "",
        "inquiryID":""
      });      
    }

    $scope.$on('ngRepeatFinished', function(event, data) {
      //
      //      var owl = $("#owl-demo");
      //
      //      owl.owlCarousel({
      //        items: 4,
      //        itemsDesktop: [1199, 3],
      //        itemsDesktopSmall: [979, 3]
      //      });
      var mySwiper = new Swiper('.swiper-container', {
        //Your options here:
        mode: 'horizontal',
        loop: false,
        freeMode: true,
        //      keyboardControl: true,
        //      mousewheelControl: true,
        slidesPerView: 'auto',
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: false,
        centeredSlides: true,
        spaceBetween: 30,
        grabCursor: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'



      });

      mySwiper.update(true);
    });


  });

angular.module('jwilliams').directive('owlcarousel', function() {

  var linker = function(scope, element, attr) {


    //carrega o carrosel
    var loadCarousel = function() {
      element.owlCarousel({
        items: 4,
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [979, 3]
      });
    }

    //aplica as ações para o carrosel
    var loadCarouselActions = function() {
      angular.element(".owlcarousel_next").click(function() {
        element.trigger('owl.next');
      })
      angular.element(".owlcarousel_prev").click(function() {
        element.trigger('owl.prev');
      })
      angular.element(".owlcarousel_play").click(function() {
        element.trigger('owl.play', 1000);
      })
      angular.element(".owlcarousel_stop").click(function() {
        element.trigger('owl.stop');
      })
    }

    //toda vez que adicionar ou remover um item da lista ele carrega o carrosel novamente
    scope.$watch("details.photos", function(value) {
      loadCarousel(element);
    })

    //inicia o carrosel
    loadCarouselActions();
  }

  return {
    restrict: "A",
    link: linker
  }

});
