app.factory('tokenService', ['$window','$http', function($window, $http) {
  var tokenService = {};
  var tokenStatus = {
    valid: false
  };
  tokenService.getAnonymousToken = function() {
    return $http({
      method: 'GET',
      url: 'http://128.199.48.244:7000/auth/anonymous'
    }).then(function(response) {
      $window.localStorage['userType'] = 'anonymous';
      $window.localStorage['userName'] = response.data.name;
      $window.localStorage['jwtToken'] = response.data.token;
      $window.localStorage['userId'] = response.data.id;
      tokenStatus.valid = true;
      $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
      return true;
    }).catch (function(response) {
      console.log("Error, could not get anonymous token!");
      throw new Error('Could not get anonymous token!');
    });
  };

  //Try to use the token to see if it's still valid
  tokenService.validateToken = function() {
    $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
    return $http({
      method: 'GET',
      url: 'http://128.199.48.244:7000/polls'
    }).then(function () {
      tokenStatus.valid = true;
    });
  }

  tokenService.getTokenStatus = function() {
    return tokenStatus;
  };

  tokenService.isUserWithInvalidToken = function(){
    return ($window.localStorage['userType'] === 'user'  && tokenStatus.valid === false);
  };

  tokenService.isUserWithValidToken = function(){
    return ($window.localStorage['userType'] === 'user'  && tokenStatus.valid === true);
  };

  tokenService.isAnonymousWithValidToken = function(){
    return ($window.localStorage['userType'] === 'anonymous'  && tokenStatus.valid === true);
  };

  tokenService.getJwt = function() {
    return $window.localStorage['jwtToken'];
  };

  tokenService.getUserType = function() {
    return $window.localStorage['userType'];
  };

  tokenService.getUserId = function() {
    return $window.localStorage['userId'];
  };

  tokenService.getTokenExists = function() {
    return ($window.localStorage['jwtToken']);
  };

  tokenService.getTokenUserName = function() {
    return $window.localStorage['userName'];
  };

  tokenService.login = function(user) {
    $http({
        method: 'POST',
        url: 'http://128.199.48.244:7000/auth',
        headers: {'Content-Type': 'application/json'},
        data: user
    }).then(function successCallback(response){

        var userData = response.data;
        $window.localStorage['userType'] = 'user';
        $window.localStorage['userId'] = userData.id;
        $window.localStorage['userName'] = userData.name;
        $window.localStorage['jwtToken'] = userData.token;

        $window.location.reload();
    }, function errorCallback(){
        console.log('error');
    });
  }
  return tokenService;
}]);
