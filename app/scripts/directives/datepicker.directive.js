'use strict';
angular.module('jwilliams').directive('jwDatepicker', function(){
	return{
		restrict: 'AE',
		templateUrl: 'app/views/datepicker.tpl.html',
		replace: true,
		scope: {
			blockedDates: "@"
		},
		controller: function($scope, $http, API_URL){
		},
		link: function(scope, http, API_URL){

			// var dp = $("#datepicker")
			//   .datepicker({
			//      onSelect: function ( dateText, inst ) {
			//            var d1, d2;
			 
			//            prv = +cur;
			//            cur = inst.selectedDay;
			//            if ( prv == -1 || prv == cur ) {
			//               prv = cur;
			//               $('#jrange input').val( dateText );
			//            } else {
			//               d1 = $.datepicker.formatDate( 
			//                      'mm/dd/yy', 
			//                      new Date( inst.selectedYear, inst.selectedMonth, Math.min(prv,cur) ), 
			//                      {} 
			//                   );
			 
			//               d2 = $.datepicker.formatDate( 
			//                      'mm/dd/yy',
			//                      new Date( inst.selectedYear, inst.selectedMonth, Math.max(prv,cur) ), 
			//                      {} 
			//                   );
			//               $('#jrange input').val( d1+' - '+d2 );
			//            }
			//      },
			//      beforeShowDay: function ( date ) {
			//           return [true, 
			//               ( (date.getDate() >= Math.min(prv, cur) && date.getDate() <= Math.max(prv, cur)) ? 
			//                           'date-range-selected' : '')];
			//      }			     
			//   });		

			// $('#datepicker')
			//   .datepicker({
			//     beforeShowDay: function ( date ) {
			//           return [true, 
			//               ( (date.getDate() >= Math.min(prv, cur) && date.getDate() <= Math.max(prv, cur)) ? 
			//                           'ui-state-active' : '')];
			//        }
			//   });		

			var datesThisMonth = [];

			scope.$watch(function(scope) { return scope.blockedDates }, function(){
				
				if (scope.blockedDates != null){
					var temp = JSON.parse(scope.blockedDates);
					alert();
					if (temp.length > 0){
						temp.forEach(function(element, index){
							if (new Date(element.blockDateStart).getMonth() == (new Date().getMonth())){
								datesThisMonth.push(element);
							}
						});
					}					
				}

			});

			function blockDatesSelect (indexDate){
				datesThisMonth.forEach(function(element,index){
					if (indexDate >= (new Date(element.blockDateStart)) && indexDate <= (new Date(element.blockDateEnd)) ){
						// return [true, 'ui-state-active'];
					} //else return [true, ''];
					return [true, 'ui-state-active'];
				});
			}

			var date = new Date();
			//$( "#datepicker" ).datepicker( "setDate", "+7d" );
			var endDate = new Date(new Date().setDate(date.getDate() + 7));
			//setSelectedDays(date, endDate);

			// var i = 0;
			// function setSelectedDays (startDate, endDate){
			// 	var rangeDays = endDate.getDate() - startDate.getDate(); 
				
			// 	var indexDate = new Date(startDate);
			// 	// var numberOfDaysToAdd = 6;
			// 	// indexDate.setDate(indexDate.getDate() + numberOfDaysToAdd); 

			// 	for(i = 0; i <= rangeDays; i++){

			// 		indexDate.setDate(startDate.getDate() + i);
			// 	}
			// }

			$( "#datepicker" ).datepicker({
				beforeShowDay: function (indexDate){
					var selected = false;
					datesThisMonth.forEach(function(element,index){
						//Check if indexDate is within range of blocked dates
						if (indexDate >= (new Date(element.blockDateStart)) && indexDate <= (new Date(element.blockDateEnd)) ){
							selected = true;
						} 
						//indexDate is same day as startDate or endDate
						else if (indexDate.getDate() == (new Date(element.blockDateStart)).getDate() || indexDate.getDate() == (new Date(element.blockDateEnd)).getDate() )
							selected = true;
					});
					if (!selected) return [true, ''];
					else  return [true, 'ui-state-active'];
				}

				// beforeShowDay: function ( indexDate ) {
		  		// 			// return [true, ( (indexDate.getDate() >= date.getDate() && indexDate.getDate() <= endDate.getDate()) ? 
				//    //                        'ui-state-active' : '')];
				// }
			});			

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
			  	
			// $scope.DateNow = new Date();

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
			// 	// datepickerAppendToBody: false,
			// 	initDate: "'2015-5-15'",
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