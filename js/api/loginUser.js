app.controller('loginUser', ['$scope', '$window', 'tokenService', function($scope, $window, tokenService) {
  $scope.loginUser = function() {
    var user = {
      'email': $scope.email,
      'password': $scope.password
    };

    tokenService.login(user)
      .then(function() {
        $window.location.reload();
      });
  };

  $scope.logoutUser = function() {
    tokenService.logout();
    $scope.dialogs.showPopup(null, 'continueToPollAs', false, false);
  }
}]);
