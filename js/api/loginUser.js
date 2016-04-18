app.controller('loginUser', function($scope, $http, $window) {
        $scope.loginUser = function (){
            user = {
            'email' : $scope.email,
            'password' : $scope.password
            };
            
            $http({
                method: 'POST',
                url: 'http://128.199.48.244:3000/auth',
                headers: {'Content-Type': 'application/json'},
                data: user
            }).then(function successCallback(response){
                
                var userData = response.data;
             
                var message = response.data.message;
                $window.localStorage['userAnon'] = userData.anon;
                $window.localStorage['userName'] = userData.name;
                $window.localStorage['jwtToken'] = userData.token;
                
                $window.location.reload();
            }, function errorCallback(){
                console.log('error');
            });            
        };
    
        $scope.logoutUser = function(){
            $window.localStorage.removeItem('jwtToken');
            $window.localStorage.removeItem('userAnon');
            $window.localStorage.removeItem('userName');
            $window.location.reload();
        }
        
});



