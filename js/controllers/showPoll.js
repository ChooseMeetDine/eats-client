/**
 * Controller for showing the active poll in a dialog
 */
app.controller('showPoll', ['$scope', '$http', 'pollService', 'tokenService', '$interval', '$window', '__env', function($scope, $http, pollService, tokenService, $interval, $window, __env) {
  $scope.isLoggedInAsUser = tokenService.isUserWithValidToken();
  $scope.isLoggedInAsAnonymous = tokenService.isAnonymousWithValidToken();
  $scope.isUserWithInvalidToken = tokenService.isUserWithInvalidToken();
  $scope.username = tokenService.getTokenUserName();

  $scope.active = pollService.getActive();

  $scope.now = new Date();

  $scope.loading = false; //Shows loading-bar when true

  // Updates the date every second to be able to compare to the expiration date of the poll
  $interval(function() {
    $scope.now = new Date();
  }, 1000);

  // Posts vote to API, update is received through sockets
  $scope.vote = function(restaurant) {
    if ($scope.now < $scope.active.raw.data.expiresAsDateObj) {
      $scope.loading = true;
      $http({
        method: 'POST',
        url: __env.API_URL + '/polls/' + $scope.active.cleaned.id + '/votes',
        headers: { 'Content-Type': 'application/json' },
        data: {
          restaurantId: restaurant
        }
      }).then(function(response) {
        $scope.loading = false;
        console.log('User voted on a restaurant');
      }).catch(function(error) {
        $scope.loading = false;
        console.log('error');
        console.log(error);
      })
    }
  };

  // Shows continueToPollAs so that the user can choose how to continue
  $scope.joinPoll = function()  {
    $scope.hide();
    $scope.show('continueToPollAs', true, false);
  };
}]);
