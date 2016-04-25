app.controller('continueAs', ['$scope', '$http', 'tokenService','$window', function($scope, $http, tokenService, $window) {
  $scope.isLoggedInAsUser = tokenService.isUserWithValidToken();
  $scope.isLoggedInAsAnonymous = tokenService.isAnonymousWithValidToken();
  $scope.isUserWithInvalidToken = tokenService.isUserWithInvalidToken();
  $scope.username = tokenService.getTokenUserName();

  $scope.continueAsAnonymous = function() {
    if(!$scope.isLoggedInAsAnonymous){
      tokenService.getAnonymousToken()
      .then(function() {
        $scope.hide();
      });
    } else {
      $scope.hide();
    }
  };

  //continueAsUser()
}]);
