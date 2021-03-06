'use strict';

angular.module('jwilliams')
  .controller('ViewUnitCtrl', function($scope, $http, $state, API_URL, $stateParams, UserDataService, UnitDataService, InquiryDataService) {

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

    UnitDataService.setUnitInfo({unitID: $stateParams.unitID});
    //Reset Inquiry data since inquiries would be based on unit
    InquiryDataService.setInquiryInfo({inquiryID: ""});

    //Get user info
    $scope.userID = UserDataService.getUserInfo().userID;

    $http.get(API_URL + 'getUnit' + '?q=' + $stateParams.unitID).success(function(unit) {
      $scope.details.name = unit.name;
      $scope.details.address = unit.address;
      $scope.details.size = unit.size;
      $scope.details.bedroomCount = unit.bedroomCount;
      $scope.details.bathroomCount = unit.bathroomCount;
      $scope.details.photos = unit.photos;
    }).error(function(err) {
      alert('warning', "Unable to get unit");
    })

    $http.get(API_URL + 'getRent' + '?q=' + $stateParams.unitID).success(function(rent) {
      $scope.details.monthlyRate = rent.monthlyRate;
      $scope.details.dailyRate = rent.dailyRate;
      $scope.details.blockDates = rent.blockDates;
    }).error(function(err) {
      alert('warning', "Unable to get rent");
    })

    $scope.DateNow = new Date();

    //Get the inquiries by this user
    $http.get(API_URL + 'getInquiries' + '?userID=' + $scope.userID).success(function(inquiries) {
      
      console.log('Inquiries - ' + inquiries);

      $scope.inquiries = inquiries;

      //get the inquiry for this unit
      if($scope.inquiries.length > 0){
          for (var i = 0; i < $scope.inquiries.length; i++){
              if ($scope.inquiries[i].unitID == UnitDataService.getUnitInfo().unitID){
                  $scope.parentInquiry = $scope.inquiries[i];
              }
          }                         
      }   

    }).error(function(err) {
      alert('warning', "Unable to get inquiries");
    });        


    // $scope.today = function() {
    //  $scope.dt = new Date();
    // };
    // $scope.today();

    // $scope.clear = function () {
    //  $scope.dt = null;
    // };

    // // Disable weekend selection
    // $scope.disabled = function(date, mode) {
    //  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    // };

    // $scope.toggleMin = function() {
    //  $scope.minDate = $scope.minDate ? null : new Date();
    // };
    // $scope.toggleMin();

    // $scope.open = function($event) {
    //  $event.preventDefault();
    //  $event.stopPropagation();

    //  $scope.opened = true;
    // };

    // $scope.dateOptions = {
    //  formatYear: 'yy',
    //  startingDay: 1
    // };

    // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    // $scope.format = $scope.formats[0];

    // var tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // var afterTomorrow = new Date();
    // afterTomorrow.setDate(tomorrow.getDate() + 2);
    // $scope.events =
    // [
    //   {
    //     date: tomorrow,
    //     status: 'full'
    //   },
    //   {
    //     date: afterTomorrow,
    //     status: 'partially'
    //   }
    // ];

    // $scope.getDayClass = function(date, mode) {
    //  if (mode === 'day') {
    //    var dayToCheck = new Date(date).setHours(0,0,0,0);

    //    for (var i=0;i<$scope.events.length;i++){
    //      var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

    //      if (dayToCheck === currentDay) {
    //        return $scope.events[i].status;
    //      }
    //    }
    //  }

    //  return '';
    // };   



    $scope.goInquire = function(unit) {

      if ($scope.parentInquiry){
        InquiryDataService.setInquiryInfo({inquiryID: $scope.parentInquiry._id,
        inquiryUnitID: $scope.parentInquiry.unitID});        
      }

      // var unitID = angular.copy($stateParams.unitID);
      // var userID = angular.copy($scope.userID);

      $state.go("inquiry");
      // $state.go("inquiry", {
      //   "inquiryID": "",
      //   "unitID": unitID,
      //   "userID": userID
      // });      
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
