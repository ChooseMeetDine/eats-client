/**
 * Controller for showing polls
 */
app.controller('showPoll', ['$scope', '$http', 'pollService', 'tokenService', '$interval', function($scope, $http, pollService, tokenService, $interval) {
  $scope.isLoggedInAsUser = tokenService.isUserWithValidToken();
  $scope.isLoggedInAsAnonymous = tokenService.isAnonymousWithValidToken();
  $scope.isUserWithInvalidToken = tokenService.isUserWithInvalidToken();
  $scope.username = tokenService.getTokenUserName();
  // $scope.parameterPollId = $location.search().poll // THIS THE THE POLL!

  $scope.active = pollService.getActive();

  $scope.userIsParticipantInPoll = pollService.checkIfUserIsParticipantInActivePoll(tokenService.getUserId());
  $scope.now = new Date(new Date() + 20000);

  $scope.users = [];
  $scope.restaurants = [];
  $scope.votes = [];

  // Updates the date every second to be able to compare to the expiration date of the poll
  // Disables joining the poll when it has 10 seconds left (to let the user have time to log in if need be)
  $interval(function() {
    $scope.now = new Date(new Date().getTime() + 20000);
  }, 1000);

  $scope.extractUsersFromActivePoll = function() {
    $scope.users = [];
    var users = $scope.active.data.relationships.users.data;

    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < $scope.active.included.length; j++) {
        if ($scope.active.included[j].id === users[i].id) {
          $scope.users.push($scope.active.included[j]);
        }
      }
    }
  };

  $scope.extractRestaurantsFromActivePoll = function() {
    $scope.restaurants = [];
    if (!$scope.active.data.relationships.restaurants) { //Prevents error when poll is created without restaurants
      return [];
    }
    var restaurants = $scope.active.data.relationships.restaurants.data;

    for (var i = 0; i < restaurants.length; i++) {
      for (var j = 0; j < $scope.active.included.length; j++) {
        if ($scope.active.included[j].id === restaurants[i].id) {
          $scope.restaurants.push($scope.active.included[j]);
        }
      }
    }
  };

  $scope.extractVotesFromActivePoll = function() {
    $scope.votes = [];
    for (let i = 0; i < $scope.active.included.length; i++) {

      if ($scope.active.included[i].type === 'vote') {
        $scope.votes.push({
          user: $scope.active.included[i].relationships.user.data.id,
          restaurant: $scope.active.included[i].relationships.restaurant.data.id
        });
      }
    }
  };

  $scope.vote = function(restaurant) {
    $http({
      method: 'POST',
      url: 'http://128.199.48.244:7000/polls/' + $scope.active.data.id + '/votes',
      headers: { 'Content-Type': 'application/json' },
      data: {
        restaurantId: restaurant
      }
    }).then(function(response) {
      alert('Bravo, du röstade! När detta händer ska realtidsuppdateringar visa din röst. Tills dess; uppdatera sidan!');
      $scope.extractVotesFromActivePoll();
    }).catch(function(error) {
      console.log('error');
      console.log(error);
    })
  };

  $scope.extractRestaurantsFromActivePoll();
  $scope.extractUsersFromActivePoll();
  $scope.extractVotesFromActivePoll();

  $scope.joinPoll = function()  {
    $scope.swap('continueToPollAs');
  };

}]);
