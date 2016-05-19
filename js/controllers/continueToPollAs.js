/**
 * Controller for the dialog that is shown when a user wants to join a poll
 */
app.controller('continueToPollAs', ['$scope', '$http', 'tokenService', '$window', 'pollService', '$location', function($scope, $http, tokenService, $window, pollService, $location) {
  $scope.isLoggedInAsUser = tokenService.isUserWithValidToken();
  $scope.isLoggedInAsAnonymous = tokenService.isAnonymousWithValidToken();
  $scope.isUserWithInvalidToken = tokenService.isUserWithInvalidToken();
  $scope.username = tokenService.getTokenUserName();
  $scope.parameterPollId = $location.search().poll // THIS THE THE POLL!

  $scope.loginStatus = {
    error: false
  };

  $scope.regStatus = {
    error: false
  };

  /**
   * Join the poll as anonymous, either with existing token or by getting a new one.
   */
  $scope.continueAsAnonymous = function() {
    if (!$scope.isLoggedInAsAnonymous) {
      tokenService.getAnonymousToken()
        .then(pollService.joinActivePoll)
        .then(function() {
          $window.location.reload();
        });
    } else {
      pollService.joinActivePoll()
      .then(function(){
        $window.location.reload();
      });
    }
  };

  /**
   * Join the poll as the logged in user
   */
  $scope.continueAsUser = function() {
    pollService.joinActivePoll()
      .then(function() {
        $window.location.reload();
      });
  }

  /**
   * Join poll by logging in as a user
   */
  $scope.loginUserAndContinue = function() {
    var user = {
      'email': $scope.email,
      'password': $scope.password
    };

    tokenService.login(user)
      .then(pollService.joinActivePoll)
      .then(function() {
        $scope.loginStatus.error = false;
        $window.location.reload();
      })
      .catch(function(err) {
        $scope.loginStatus.error = true;
        console.log('Fel vid inloggning av användare: ');
        console.log(err);
      });
  };

  /**
   * Join poll by registering a new user
   */
  $scope.registerUserAndContinue = function() {
    var user = {
      'email': $scope.email,
      'password': $scope.password,
      'name': $scope.name
    };

    tokenService.register(user)
      .then(pollService.joinActivePoll)
      .then(function() {
        $scope.regStatus.error = false;
        $window.location.reload();
      })
      .catch(function(err) {
        $scope.regStatus.error = true;
        console.log('ERROR! Failed to register user.');
        console.log(err);
      });
  };
}]);
