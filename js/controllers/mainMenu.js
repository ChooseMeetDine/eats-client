/**
 * Controller for the main menu
 */
app.controller('mainMenu', ['$scope', '$window', 'tokenService', function($scope, $window, tokenService) {
  $scope.tokenData = tokenService.getTokenData();
  $scope.isUserWithValidToken = tokenService.isUserWithValidToken();

  $scope.logoutUser = function() {
    tokenService.logout();
    $window.location.reload();
  }
}]);
