app.controller('authJwt', function($scope, $window) {
    $scope.jwt = $window.localStorage['userAnon'];
    $scope.name = $window.localStorage['userName'];
    if(localStorage.getItem("userAnon") != 'false'){
        $scope.access = true;
    }else{
        $scope.access = false;
    }
    
});