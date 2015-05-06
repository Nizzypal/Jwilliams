'use strict';
angular.module('jwilliams').directive('jwDatepicker', function(){
	return{
		restrict: 'AE',
		templateUrl: 'app/views/datepicker.tpl.html',
		replace: true,
		scope: {

		},
		controller: function($scope, $http, API_URL){
		},
		link: function($scope, $http, API_URL){

			var dp = $( "#datepicker" ).datepicker();
			dp.hide();
			var dpShow = false;

			$("#dateLink").click(function(){
				if (dpShow == false){
					dpShow = true;
					dp.show();
					dp.triggerHandler("focus");	
					dp.hide();			
				} else {
					dpShow = false;
					dp.show();
					dp.triggerHandler("focus");	
					dp.hide();						
					//dp.blur();						
				}
			});

			// $( "#datepicker" ).datepicker();

			// $scope.today = function() {
			// 	$scope.dt = new Date();
			// };
			// $scope.today();

			// $scope.clear = function () {
			// 	$scope.dt = null;
			// };

			// // Disable weekend selection
			// $scope.disabled = function(date, mode) {
			// 	return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
			// };

			// $scope.toggleMin = function() {
			// 	$scope.minDate = $scope.minDate ? null : new Date();
			// };
			// $scope.toggleMin();

			// $scope.open = function($event) {
			// 	$event.preventDefault();
			// 	$event.stopPropagation();

			// 	$scope.opened = true;
			// };

			// $scope.dateOptions = {
			// 	formatYear: 'yy',
			// 	startingDay: 1
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
			// 	if (mode === 'day') {
			// 	  var dayToCheck = new Date(date).setHours(0,0,0,0);

			// 	  for (var i=0;i<$scope.events.length;i++){
			// 	    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

			// 	    if (dayToCheck === currentDay) {
			// 	      return $scope.events[i].status;
			// 	    }
			// 	  }
			// 	}

			// 	return '';
			// };			
		}
	};
});