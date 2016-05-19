/**
 * Controller for adding restaurants to form when creating a poll
 */
app.controller('addRestaurantsToPoll', ['$scope', 'pollService', 'modeService', '$mdDialog', function($scope, pollService, modeService, $mdDialog) {
  $scope.form = pollService.getForm();

  //Remove restaurant
  $scope.remove = function($chip) {
    pollService.removeRestaurantFromForm($chip);
  };

  //Add restaurant
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

  //Switch back to default mode,
  $scope.switchToDefaultMode = function() {
    modeService.setMode('DEFAULT');
  }

  //Go back to createpoll
  $scope.done = function() {
    $scope.dialogs.showPopup(null, 'createpoll', true, false);
    modeService.setMode('DEFAULT');
  }
}]);
