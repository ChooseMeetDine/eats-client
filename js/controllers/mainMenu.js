app.controller('mainMenu', ['$scope', 'tokenService', function($scope, tokenService) {
  $scope.tokenData = tokenService.getTokenData();
  $scope.isUserWithValidToken = tokenService.isUserWithValidToken();
}]);
