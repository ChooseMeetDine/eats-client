app.controller('activePolls', ['$scope', 'pollService', '$http', '$q', '$window', '$location', '__env', '$interval', function($scope, pollService, $http, $q, $window, $location, __env, $interval) {
  $scope.polls = pollService.getAll();
  parameterPollId = $location.search().poll; // poll ID from URL

  // Updates the date every second to be able to compare to the expiration date of the poll
  $interval(function() {
    $scope.now = new Date();
  }, 1000);

  //For each poll that has not exipred when page is loaded, set a timeout that shows a popup when poll has exipred
  var showPopupWhenPollExipres = function(poll){
      if($scope.now < poll.data.expiresAsDateObj) {

        setTimeout(function(){
          var active = pollService.getActive();
          if(!active.raw.data || active.raw.data.id !== poll.data.id) {
            pollService.setActiveId(poll.data.id);
            console.log(poll.data.id)
            $scope.dialogs.showPopup(null, 'showActivePoll', true, true);
          }
        }, 10);
        // }, poll.data.expiresAsDateObj - new Date());
      }
  };

  $scope.switchActivePoll = function(poll) {
    pollService.setActiveId(poll.data.id);
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
      showPopupWhenPollExipres(response.data);

    });
  };

  getPolls(); //Get all polls connected to active user
}]);
