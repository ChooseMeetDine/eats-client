app.controller('activePolls', ['$scope', 'pollService', '$http', '$q', '$window', '$location', '__env', '$interval', function($scope, pollService, $http, $q, $window, $location, __env, $interval) {
  $scope.polls = pollService.getAll();
  parameterPollId = $location.search().poll; // poll ID from URL

  // Updates the date every second to be able to compare to the expiration date of the poll
  $interval(function() {
    $scope.now = new Date();
  }, 1000);


  $scope.switchActivePoll = function(poll) {
    if (poll.raw.data.hasExpired) {
      poll.raw.data.userHasSeenExpiredPopup = true;
    }

    pollService.setActiveId(poll.raw.data.id);
  }

  var getPolls = function() {
    var currentDate = new Date();
    $scope.displayDate = currentDate.getTime();

    var voteMap = {};
    voteMap.user = [];
    voteMap.restaurant = [];
    voteMap.vote = [];
    voteMap.group = [];

    $http({
      methos: 'GET',
      url: __env.API_URL + '/polls'
    }).then(function successCallback(response) {

      var pollRequests = [];
      for (var i = 0; i < response.data.data.length; i++) {
        pollRequests.push(getSinglePoll(response.data.data[i].id))
      }

      $q.all(pollRequests); //Get all polls and add them to service

    }).catch(function(error) {
      console.log('Error!' + error);
    });
  };

  var getSinglePoll = function(pollId) {
    return $http({
      methos: 'GET',
      url: __env.API_URL + '/polls/' + pollId
    }).then(function(response) {
      pollService.add(response.data);
    });
  };

  getPolls(); //Get all polls connected to active user
}]);
