app.controller('activePolls', ['$scope', 'pollService', '$http', '$q','$window', function($scope, pollService, $http, $q, $window) {

  $scope.polls = pollService.getAll();

  $scope.switchActivePoll = function(poll) {
      pollService.setActiveId(poll.data.id);
  }

  var getPolls = function(){
    var currentDate = new Date();
    $scope.displayDate = currentDate.getTime();

    var voteMap = {};
        voteMap.user = [];
        voteMap.restaurant = [];
        voteMap.vote = [];
        voteMap.group = [];

    $http({
        methos: 'GET',
        url:"http://128.199.48.244:7000/polls"
    }).then(function successCallback(response) {

      var pollRequests = [];
      for (let i = 0; i < response.data.data.length; i++) {
        pollRequests.push(getSinglePoll(response.data.data[i].id))
      }

      $q.all(pollRequests); //Get all polls and add them to service

    }).catch(function(error) {
      console.log('Error!' + error);
    });
  };

  var getSinglePoll = function(pollId){
    return $http({
      methos: 'GET',
      url:"http://128.199.48.244:7000/polls/" + pollId
    }).then(function(response) {
      pollService.add(response.data);
    });
  };

  getPolls(); //Get all polls connected to active user
}]);
