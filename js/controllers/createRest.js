app.controller('createRest', function($scope, $mdDialog, $mdMedia) {
  $scope.showAdvanced = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'pages/templates/createRestaurant.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })};
});

function DialogController($scope, $mdDialog) {
  $scope.cancel = function() {
    $mdDialog.cancel();
  };

}