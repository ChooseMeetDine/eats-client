app.factory('tokenService', ['$window', '$http', '__env', function($window, $http, __env) {
  var tokenService = {};

  tokenService.getAnonymousToken = function() {
    $http({
      method: 'GET',
      url: __env.API_URL + '/auth/anonymous'
    }).then(function(response) {
      var token = response.data.token;
      $window.localStorage['userAnon'] = response.data.anon;
      $window.localStorage['userName'] = response.data.name;
      $window.localStorage['jwtToken'] = token;
      $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
      console.log(token);
      $window.location.reload();
    }).catch(function errorCallback(response) {
      console.log("Error, could not get anonymous token!");
    });
  };

  //Try to use the token to see if it's still valid
  tokenService.testToken = function() {
    return $http({
      method: 'GET',
      url: __env.API_URL + '/polls'
    })
  }

  return tokenService;
}]);
