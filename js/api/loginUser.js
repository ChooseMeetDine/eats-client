app.controller('loginUser', ['$scope', '$window', 'tokenService', function($scope, $window, tokenService) {
  $scope.loginStatus = {
    error: false
  };

  $scope.loginUser = function() {
    $scope.test = false;
    var user = {
      'email': $scope.email,
      'password': $scope.password
    };

    tokenService.login(user)
      .then(function() {
        $scope.loginStatus.error = false;
        $window.location.reload();
      })
      .catch(function(err) {
        $scope.loginStatus.error = true;
      });
  };

  $scope.logoutUser = function() {
    tokenService.logout();
    $scope.dialogs.showPopup(null, 'continueToPollAs', false, false);
  }
}]);
