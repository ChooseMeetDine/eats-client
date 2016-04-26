app.controller('continueToPollAs', ['$scope', '$http', 'tokenService','$window', 'pollService', '$location', function($scope, $http, tokenService, $window, pollService, $location) {
  $scope.isLoggedInAsUser = tokenService.isUserWithValidToken();
  $scope.isLoggedInAsAnonymous = tokenService.isAnonymousWithValidToken();
  $scope.isUserWithInvalidToken = tokenService.isUserWithInvalidToken();
  $scope.username = tokenService.getTokenUserName();
  $scope.parameterPollId = $location.search().poll // THIS THE THE POLL!

  $scope.continueAsAnonymous = function() {
    if(!$scope.isLoggedInAsAnonymous){
      tokenService.getAnonymousToken()
      .then(function() {
        $scope.hide();
      });
    } else {
      pollService.joinPoll($scope.parameterPollId);
      $scope.hide();
    }
  };

  //continueAsUser()
}]);
