app.controller('logoutUser', '__env', function($http, $window, __env) {
  $http({
    method: 'POST',
    url: __env.API_URL + '/auth',
    headers: { 'Content-Type': 'application/json' },
    data: user
  }).then(function successCallback(response) {
    var token = response.data.token;
    var message = response.data.message;
    $window.localStorage.removeItem('jwtToken');
  }, function errorCallback() {
    console.log('error');
  });
});
