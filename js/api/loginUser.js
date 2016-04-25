app.controller('loginUser', [ '$scope', '$http', '$window','tokenService', function($scope, $http, $window, tokenService) {
  $scope.loginUser = function (){
    var user = {
    'email' : $scope.email,
    'password' : $scope.password
    };

    tokenService.login(user);
  };

        $scope.logoutUser = function(){
            $window.localStorage.removeItem('jwtToken');
            $window.localStorage.removeItem('userAnon');
            $window.localStorage.removeItem('userName');
            $scope.dialogs.showAdvanced(null, 'continueAs');
        }

}]);
