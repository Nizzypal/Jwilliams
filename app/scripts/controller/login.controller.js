angular.module('jwilliams').controller('LoginCtrl', function($scope, $stateParams){
	vm = this;
	vm.submit = function(){
		alert('test');
	};

	$scope.submit = vm.submit;
});