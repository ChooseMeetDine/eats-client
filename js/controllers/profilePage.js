/**
 * Controller for the profilePage
 */
app.controller('profilePage', ['$scope', 'tokenService', function($scope, tokenService) {
    $scope.tokenData = tokenService.getTokenData();
}]);
