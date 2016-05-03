app.controller('addUser', ['$scope', '$http', '__env', function($scope, $http, __env) {
  $scope.regUser = function() {
    user = {
      'name': $scope.name,
      'password': $scope.password,
      'email': $scope.email
    };
    $http({
      method: 'POST',
      url: __env.API_URL + '/users',
      headers: { 'Content-Type': 'application/json' },
      data: user
    }).then(function successCallback(response) {
      console.log(response.data.message);
      console.log(user);
      console.log(response.data.token);
    }, function errorCallback() {
      $scope.regUser = "error";
    });
    console.log(user);
  };
}]);
