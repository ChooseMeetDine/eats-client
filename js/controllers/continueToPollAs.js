app.controller('continueToPollAs', ['$scope', '$http', 'tokenService', '$window', 'pollService', '$location', function($scope, $http, tokenService, $window, pollService, $location) {
  $scope.isLoggedInAsUser = tokenService.isUserWithValidToken();
  $scope.isLoggedInAsAnonymous = tokenService.isAnonymousWithValidToken();
  $scope.isUserWithInvalidToken = tokenService.isUserWithInvalidToken();
  $scope.username = tokenService.getTokenUserName();
  $scope.parameterPollId = $location.search().poll // THIS THE THE POLL!

  $scope.continueAsAnonymous = function() {
    if (!$scope.isLoggedInAsAnonymous) {
      tokenService.getAnonymousToken()
        .then(pollService.joinActivePoll)
        .then(function() {
          $window.location.reload();
        });
    } else {
      pollService.joinActivePoll();
      $window.location.reload();
    }
  };

  $scope.continueAsUser = function() {
    pollService.joinActivePoll()
      .then(function() {
        $window.location.reload();
      });
  }

  $scope.loginUserAndContinue = function() {
    var user = {
      'email': $scope.email,
      'password': $scope.password
    };

    tokenService.login(user)
      .then(pollService.joinActivePoll)
      .then(function() {
        $window.location.reload();
      })
      .catch(function(err) {
        console.log('Fel vid inloggning av användare: ');
        console.log(err);
      });
  };

  $scope.registerUserAndContinue = function() {
    var user = {
      'email': $scope.email,
      'password': $scope.password,
      'name': $scope.name
    };

    tokenService.register(user)
      .then(pollService.joinActivePoll)
      .then(function() {
        $window.location.reload();
      })
      .catch(function(err) {
        console.log('ERROR! Failed to register user.');
        console.log(err);
      });
  };
}]);
