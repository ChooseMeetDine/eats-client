app.factory('tokenService', ['$window','$http', function($window, $http) {
  var tokenService = {};

  tokenService.getAnonymousToken = function() {
    $http({
      method: 'GET',
      url: 'http://128.199.48.244:7000/auth/anonymous'
    }).then(function(response) {
      var token = response.data.token;
      $window.localStorage['userAnon'] = response.data.anon;
      $window.localStorage['userName'] = response.data.name;
      $window.localStorage['jwtToken'] = token;
      $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
      $window.location.reload();
    }).catch (function errorCallback(response) {
      console.log("Error, could not get anonymous token!");
    });
  };

  //Try to use the token to see if it's still valid
  tokenService.testToken = function() {
    $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
    return $http({
      method: 'GET',
      url: 'http://128.199.48.244:7000/polls'
    })
  }

  return tokenService;
}]);
