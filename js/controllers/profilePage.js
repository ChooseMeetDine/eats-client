app.controller('profilePage', ['$scope', 'tokenService', function($scope, tokenService) {
    $scope.tokenData = tokenService.getTokenData();
    console.log($scope.tokenData);
}]);
