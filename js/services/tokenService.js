/**
 *  Service that handles tokens
 */
app.factory('tokenService', ['$window', '$http', '__env', function($window, $http, __env) {
  var tokenService = {};
  var tokenData = {
    valid: false,
    userType: $window.localStorage['userType'], // 'anonymous' or 'user'
    id: $window.localStorage['userId'],         // Users ID
    name: $window.localStorage['userName'],     // Users name
    jwt: $window.localStorage['jwtToken']       // The actual JWT-token
  };

  /**
   * Get anonymous token and save to localStorage
   */
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

  /**
   * Uses the token in a common request to see if it is valid.
   * If the token is invalid, this removes jwtToken and userId from local storage
   * @return true for valid, false for invalid
   */
  tokenService.validateToken = function() {
    $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken'];
    //console.log('Validating token for ' + $window.localStorage['userName'] + '... ');

    return $http({
        method: 'GET',
        url: __env.API_URL + '/polls'
      }).then(function() {
        //console.log('Token is valid');
        tokenData.valid = true;
        return true;
      })
      .catch(function(err) {
        //If invalid token, clear tokendata but save userType and userName
        //that can be used to see who was logged in before
        $window.localStorage.removeItem('jwtToken');
        $window.localStorage.removeItem('userId');
        return false;
      });
  }

  // Returns token data, including jwtToken, userName etc.
  tokenService.getTokenData = function() {
    return tokenData;
  };

  //Returns true if current token belongs to a registered user, but the token is invalid (expired most likley)
  tokenService.isUserWithInvalidToken = function() {
    return ($window.localStorage['userType'] === 'user' && tokenData.valid === false);
  };

  //Returns true if current token belongs to a registered user, and the token is valid
  tokenService.isUserWithValidToken = function() {
    return ($window.localStorage['userType'] === 'user' && tokenData.valid === true);
  };

  //Returns true if current token belongs to an anonymous user, and the token is valid
  tokenService.isAnonymousWithValidToken = function() {
    return ($window.localStorage['userType'] === 'anonymous' && tokenData.valid === true);
  };

  //returns current JWT-token
  tokenService.getJwt = function() {
    return $window.localStorage['jwtToken'];
  };

  //returns 'user' or 'anonymous' depending on current users type
  tokenService.getUserType = function() {
    return $window.localStorage['userType'];
  };

  //returns current users ID
  tokenService.getUserId = function() {
    return $window.localStorage['userId'];
  };

  //returns true if a JWT-token exists
  tokenService.getTokenExists = function() {
    return ($window.localStorage['jwtToken']);
  };

  //returns current users name
  tokenService.getTokenUserName = function() {
    return $window.localStorage['userName'];
  };

  /**
   * Login for registered users and saves JWT-token and user data to localStorage
   * @param  {object} user Contains email and password, used as POST-body
   */
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

  /**
   * Clears localStorage from JWT-token and user data
   */
  tokenService.logout = function() {
    $window.localStorage.removeItem('userType');
    $window.localStorage.removeItem('userId');
    $window.localStorage.removeItem('userName');
    $window.localStorage.removeItem('jwtToken');
  };

  /**
   * Register user, then logs user in if successful
   */
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
