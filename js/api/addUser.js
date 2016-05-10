app.controller('addUser', ['$scope', '$http', '__env', 'tokenService', '$window', function($scope, $http, __env, tokenService, $window) {
  $scope.regStatus = {
    error: false
  };

  $scope.regUser = function() {
    var user = {
      'name': $scope.name,
      'password': $scope.password,
      'email': $scope.email
    };

    $http({
        method: 'POST',
        url: __env.API_URL + '/users',
        headers: { 'Content-Type': 'application/json' },
        data: user
      }).then(function(response) {
        console.log('User registered, proceeding to log in');

        var user = {
          'email': $scope.email,
          'password': $scope.password
        };

        tokenService.login(user)
          .then(function() {
            console.log('User logged in');
            $scope.regStatus.error = false;
            $window.location.reload();
          })
          .catch(function(err) {
            $scope.regStatus.error = true;
            console.log('User log in failed after registration!');
          });

      })
      .catch(function() {
        $scope.regStatus.error = true;
        console.log('User registration failed!');
      });
  };
}]);
