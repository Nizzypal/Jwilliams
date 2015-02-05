'use strict';

describe('Controller: SelectmealCtrl', function () {

  // load the controller's module
  beforeEach(module('skitchenApp'));

  var SelectmealCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SelectmealCtrl = $controller('SelectmealCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
