/**
 * Controller for active polls, shown in the bottom left corner of the web page
 */
app.controller('activePolls', ['$scope', 'pollService', '$http', '$q', '$window', '$location', '__env', '$interval', function($scope, pollService, $http, $q, $window, $location, __env, $interval) {
  $scope.polls = pollService.getAll();
  parameterPollId = $location.search().poll; //Get poll-ID from URL

  // Updates the date every second to be able to compare to the expiration date of the poll
  $interval(function() {
    $scope.now = new Date();
  }, 1000);

  //Switch active poll, when a poll-button is clicked in the bottom left corner of the web page
  $scope.switchActivePoll = function(poll) {
    if (poll.raw.data.hasExpired) {
      poll.raw.data.userHasSeenExpiredPopup = true; //Removed the notification popup
    }

    pollService.setActiveId(poll.raw.data.id);
  }

  /**
   * Get all polls the current user has access to
   */
  var getPolls = function() {
    $http({
      methos: 'GET',
      url: __env.API_URL + '/polls'
    }).then(function(response) {

      var pollRequests = [];
      for (var i = 0; i < response.data.data.length; i++) {
        pollRequests.push(getSinglePoll(response.data.data[i].id));
      }

      $q.all(pollRequests); //Get mor info for all polls and add them to service asynchronously
    }).catch(function(error) {
      console.log('Error!' + error);
    });
  };

  //Get more info about a poll
  var getSinglePoll = function(pollId) {
    return $http({
      methos: 'GET',
      url: __env.API_URL + '/polls/' + pollId
    }).then(function(response) {
      pollService.add(response.data);
    });
  };

  getPolls(); //Get all polls connected to current user when controller loads
}]);
