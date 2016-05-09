app.controller('addRestaurantsToPoll', ['$scope', 'pollService', 'modeService', '$mdDialog', function($scope, pollService, modeService, $mdDialog) {
  $scope.form = pollService.getForm();

  $scope.remove = function($chip) {
    pollService.removeRestaurantFromForm($chip);
  };

  $scope.add = function() {
    pollService.addRestaurantToForm({
      data: {
        id: 12,
        attributes: {
          name: 'Whopii'
        }
      }
    })
  }

  $scope.switchToDefaultMode = function() {
    modeService.setMode('DEFAULT');
  }

  $scope.done = function() {
    $scope.dialogs.showPopup(null, 'createpoll', true, false);
    modeService.setMode('DEFAULT');
  }
}]);
