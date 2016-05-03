/**
 * Controller for showing polls
 */
app.controller('showPoll', ['$scope', '$http', 'pollService', 'tokenService', '$interval', '$window', function($scope, $http, pollService, tokenService, $interval, $window) {
  $scope.isLoggedInAsUser = tokenService.isUserWithValidToken();
  $scope.isLoggedInAsAnonymous = tokenService.isAnonymousWithValidToken();
  $scope.isUserWithInvalidToken = tokenService.isUserWithInvalidToken();
  $scope.username = tokenService.getTokenUserName();

  $scope.active = pollService.getActive();

  $scope.userIsParticipantInPoll = pollService.checkIfUserIsParticipantInActivePoll(tokenService.getUserId());
  $scope.restaurantIdUserHasVotedOn = pollService.checkWhatRestaurantUserHasVotedOnInActivePoll(tokenService.getUserId());
  $scope.now = new Date(new Date() + 20000);

  $scope.activePollCleaned = pollService.getActiveWithCleanedData();
  console.log($scope.activePollCleaned);
  // TODO (eventuellt): 
  // - fixa så att man kan ändra sin röst om man redan har röstat (är PUT på en vote implementerat?)
  // --- Eller ska det räcka med att göra en POST på en restaurang man inte redan röstat på?


  // Updates the date every second to be able to compare to the expiration date of the poll
  // Disables joining the poll when it has 10 seconds left (to let the user have time to log in if need be)
  $interval(function() {
    $scope.now = new Date(new Date().getTime() + 20000);
  }, 1000);

  $scope.vote = function(restaurant) {
    $http({
      method: 'POST',
      url: 'http://128.199.48.244:7000/polls/' + $scope.activePollCleaned.id + '/votes',
      headers: { 'Content-Type': 'application/json' },
      data: {
        restaurantId: restaurant
      }
    }).then(function(response) {
      alert('Bravo, du röstade! När detta händer ska realtidsuppdateringar visa din röst. Istället kommer sidan uppdateras när du klickat på OK (temporär lösning)!');
      $window.location.reload();
    }).catch(function(error) {
      console.log('error');
      console.log(error);
    })
  };

  $scope.joinPoll = function()  {
    $scope.swap('continueToPollAs');
  };

}]);
