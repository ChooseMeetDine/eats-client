app.factory('tokenService', ['$window', '$http', '__env', function($window, $http, __env) {
  var tokenService = {};
  var tokenData = {
    valid: false,
    userType: $window.localStorage['userType'], // 'anonymous' or 'user'
    id: $window.localStorage['userId'],
    name: $window.localStorage['userName'],
    jwt: $window.localStorage['jwtToken']
  };

  tokenService.getAnonymousToken = function() {
    return $http({
      method: 'GET',
      url: __env.API_URL + '/auth/anonymous'
    }).then(function(response) {
      tokenData.valid = true;

      $window.localStorage['userType'] = 'anonymous';
      $window.localStorage['userName'] = response.data.name;
      $window.localStorage['jwtToken'] = response.data.token;
      $window.localStorage['userId'] = response.data.id;

      $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
      return true;
    }).catch(function(response) {
      console.log("Error, could not get anonymous token!");
      throw new Error('Could not get anonymous token!');
    });
  };

  //Try to use the token to see if it's still valid
  tokenService.validateToken = function() {
    $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
    console.log('Validating token for ' + $window.localStorage['userName'] + '... ');

    return $http({
        method: 'GET',
        url: __env.API_URL + '/polls'
      }).then(function() {
        console.log('Token is valid');
        tokenData.valid = true;
        return true;
      })
      .catch(function(err) {
        console.log(err);
        return false;
      });
  }

  tokenService.getTokenData = function() {
    return tokenData;
  };

  tokenService.isUserWithInvalidToken = function() {
    return ($window.localStorage['userType'] === 'user' && tokenData.valid === false);
  };

  tokenService.isUserWithValidToken = function() {
    return ($window.localStorage['userType'] === 'user' && tokenData.valid === true);
  };

  tokenService.isAnonymousWithValidToken = function() {
    return ($window.localStorage['userType'] === 'anonymous' && tokenData.valid === true);
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
    return $http({
        method: 'POST',
        url: __env.API_URL + '/auth',
        headers: { 'Content-Type': 'application/json' },
        data: user
      })
      .then(function successCallback(response) {
        tokenData.valid = true;

        var userData = response.data;
        $window.localStorage['userType'] = 'user';
        $window.localStorage['userId'] = userData.id;
        $window.localStorage['userName'] = userData.name;
        $window.localStorage['jwtToken'] = userData.token;

        $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
      })
      .catch(function(err) {
        console.log('Error when trying to log in user ' + user.email);
        throw err;
      });
  }

  tokenService.logout = function() {
    $window.localStorage.removeItem('userType');
    $window.localStorage.removeItem('userId');
    $window.localStorage.removeItem('userName');
    $window.localStorage.removeItem('jwtToken');
  };

  tokenService.register = function(userForRegister) {
    return $http({
        method: 'POST',
        url: __env.API_URL + '/users',
        headers: { 'Content-Type': 'application/json' },
        data: userForRegister
      })
      .catch(function(err) {
        console.log('Error when trying to register user ' + userForRegister.email);
        throw err;
      })
      .then(function loginUser(response) {
        var userForLogin = {
          email: userForRegister.email,
          password: userForRegister.password
        }

        return tokenService.login(userForLogin);
      })
  }

  return tokenService;
}]);
