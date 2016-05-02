/**
 * Controller for showing polls
 */
app.controller('showPoll', ['$scope', '$http', 'pollService', 'tokenService', '$interval', '$window', function($scope, $http, pollService, tokenService, $interval, $window) {
  $scope.isLoggedInAsUser = tokenService.isUserWithValidToken();
  $scope.isLoggedInAsAnonymous = tokenService.isAnonymousWithValidToken();
  $scope.isUserWithInvalidToken = tokenService.isUserWithInvalidToken();
  $scope.username = tokenService.getTokenUserName();
  // $scope.parameterPollId = $location.search().poll // THIS THE THE POLL!

  $scope.active = pollService.getActive();

  $scope.userIsParticipantInPoll = pollService.checkIfUserIsParticipantInActivePoll(tokenService.getUserId());
  $scope.restaurantIdUserHasVotedOn = pollService.checkWhatRestaurantUserHasVotedOnInActivePoll(tokenService.getUserId());
  $scope.now = new Date(new Date() + 20000);

  $scope.activePollCleaned = pollService.getActiveWithCleanedData();


  // TODO: 
  // !! HÄR ÄR JAG !!
  // - fixa så att röstningslänken ligger i scope - så att designarna kan nå den
  // - användaren "davve@mail.se" verkar hämta en massa polls som han inte är med i.. varför då?
  // 
  // eventuellt: 
  // - fixa så att man kan ändra sin röst om man redan har röstat (är PUT på en vote implementerat?)
  // --- Eller ska det räcka med att göra en POST på en restaurang man inte redan röstat på?


  // $scope.users = [];
  // $scope.restaurants = [];
  // $scope.votes = [];

  // Updates the date every second to be able to compare to the expiration date of the poll
  // Disables joining the poll when it has 10 seconds left (to let the user have time to log in if need be)
  $interval(function() {
    $scope.now = new Date(new Date().getTime() + 20000);
  }, 1000);

  // $scope.extractUsersFromActivePoll = function() {
  //   $scope.users = [];
  //   var users = $scope.active.data.relationships.users.data;

  //   for (var i = 0; i < users.length; i++) {
  //     for (var j = 0; j < $scope.active.included.length; j++) {
  //       if ($scope.active.included[j].id === users[i].id) {
  //         $scope.users.push($scope.active.included[j]);
  //       }
  //     }
  //   }
  // };

  // $scope.extractRestaurantsFromActivePoll = function() {
  //   $scope.restaurants = [];
  //   if (!$scope.active.data.relationships.restaurants) { //Prevents error when poll is created without restaurants
  //     return [];
  //   }
  //   var restaurants = $scope.active.data.relationships.restaurants.data;

  //   for (var i = 0; i < restaurants.length; i++) {
  //     for (var j = 0; j < $scope.active.included.length; j++) {
  //       if ($scope.active.included[j].id === restaurants[i].id) {
  //         $scope.restaurants.push($scope.active.included[j]);
  //       }
  //     }
  //   }
  // };

  // $scope.extractVotesFromActivePoll = function() {
  //   $scope.votes = [];
  //   for (let i = 0; i < $scope.active.included.length; i++) {

  //     if ($scope.active.included[i].type === 'vote') {
  //       $scope.votes.push({
  //         user: $scope.active.included[i].relationships.user.data.id,
  //         restaurant: $scope.active.included[i].relationships.restaurant.data.id
  //       });
  //     }
  //   }
  // };

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

  // $scope.extractRestaurantsFromActivePoll();
  // $scope.extractUsersFromActivePoll();
  // $scope.extractVotesFromActivePoll();


  $scope.joinPoll = function()  {
    $scope.swap('continueToPollAs');
  };

}]);
