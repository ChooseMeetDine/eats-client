app.controller('logoutUser', function($http, $window) {
    $http({
        method: 'POST',
        url: 'http://localhost:3000/auth',
        headers: {'Content-Type': 'application/json'},
        data: user
    }).then(function successCallback(response){
        var token = response.data.token;
        var message = response.data.message;
        $window.localStorage.removeItem('jwtToken');
    }, function errorCallback(){
        console.log('error');
    });
});