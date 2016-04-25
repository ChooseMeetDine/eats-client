app.controller('continueAs', ['$scope', '$http', 'tokenService','$window', function($scope, $http, tokenService, $window) {

  $scope.continueWithPresentTokenOrGetAnonymous = function() {
    $http.defaults.headers.common['x-access-token'] = $window.localStorage['jwtToken']; //use the token
    tokenService.testToken()  //Try to use the token to see if it's still valid
    .then(function(response) {
      console.log('You are now logged in as ' + $window.localStorage['userName']);
    }).catch(function(response) {
      tokenService.getAnonymousToken(); //The token was not valid, get a new one
    });
  };
}]);
