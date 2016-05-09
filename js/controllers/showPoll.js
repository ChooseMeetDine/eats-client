/**
 * Controller for showing polls
 */
app.controller('showPoll', ['$scope', '$http', 'pollService', 'tokenService', '$interval', '$window', '__env', function($scope, $http, pollService, tokenService, $interval, $window, __env) {
  $scope.isLoggedInAsUser = tokenService.isUserWithValidToken();
  $scope.isLoggedInAsAnonymous = tokenService.isAnonymousWithValidToken();
  $scope.isUserWithInvalidToken = tokenService.isUserWithInvalidToken();
  $scope.username = tokenService.getTokenUserName();

  $scope.active = pollService.getActive();

  $scope.now = new Date(new Date() + 20000);

  // $scope.activePollCleaned = pollService.getActiveWithCleanedData();
  // TODO (eventuellt): 
  // - fixa så att man kan ändra sin röst om man redan har röstat (är PUT på en vote implementerat?)
  // --- Eller ska det räcka med att göra en POST på en restaurang man inte redan röstat på?


  // Updates the date every second to be able to compare to the expiration date of the poll
  // Disables joining the poll when it has 20 seconds left (to let the user have time to log in if need be)
  $interval(function() {
    $scope.now = new Date(new Date().getTime() + 20000);
  }, 1000);

  $scope.vote = function(restaurant) {
    $http({
      method: 'POST',
      url: __env.API_URL + '/polls/' + $scope.active.cleaned.id + '/votes',
      headers: { 'Content-Type': 'application/json' },
      data: {
        restaurantId: restaurant
      }
    }).then(function(response) {
      console.log('User voted on a restaurant');
    }).catch(function(error) {
      console.log('error');
      console.log(error);
    })
  };

  $scope.joinPoll = function()  {
    $scope.swap('continueToPollAs', true, false);
  };
}]);
