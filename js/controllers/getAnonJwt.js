app.controller('getAnonJwt', function($http, $window) {  
    var anon = $window.localStorage['userAnon'];
    if(localStorage.getItem("userAnon") === null){    
        $http({
            method: 'GET',
            url: 'http://128.199.48.244:3000/auth/anonymous'
        }).then(function successCallback(response) {
            var token = response.data.token;
            $window.localStorage['userAnon'] = response.data.anon;
            $window.localStorage['userName'] = response.data.name;
            $window.localStorage['jwtToken'] = token;
            console.log(token);
        }, function errorCallback(response) {
           console.log("Error, cannot load Anonynous User!");
        });
    }else{
            
    }
});