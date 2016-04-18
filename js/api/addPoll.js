app.controller('addPoll', function($scope, $http) {
        $scope.allowNewRestaurants = {value1: false};
        $scope.regPoll = function (){
            poll = {
                'name': $scope.name,
                'expires': $scope.expires,
                'restaurants': [$scope.restaurants],
                /*'users': [$scope.users],*/
                /*'group': $scope.group*/
                'allowNewRestaurants': $scope.allowNewRestaurants.value1
            };
            console.log(poll);
            
            $http({
                method: 'POST',
                url: 'http://128.199.48.244:3000/polls' ,
                headers: {'Content-Type': 'application/json'},
                data: poll
            }).then(function successCallback(response){
                var token = response.data.token;
                var message = response.data.message;
                
                $scope.regUser = message;
            }, function errorCallback(){
                $scope.regUser = "error";
            });
        };
    });

                   
                