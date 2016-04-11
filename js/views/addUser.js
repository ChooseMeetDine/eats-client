app.controller('addUser', function($scope, $http) {
        $scope.regUser = function (){
            user = {
                'name': $scope.name,
                'password': $scope.password,
                'email': $scope.email
            };
            $http({
                method: 'POST',
                url: 'http://128.199.48.244:3000/users',
                headers: {'Content-Type': 'application/json'},
                data: user
            }).then(function successCallback(response){
                console.log(response.data.message);
                console.log(user);
                console.log(response.data.token);
            }, function errorCallback(){
                $scope.regUser = "error";
            });
            
            console.log(user);   
            
        };
    });
                   
                