/**
 * Controller for showing polls
 */
app.controller('showPoll', ['$scope', '$http', 'pollService', function($scope, $http, pollService) {
  $scope.active = pollService.getActive();

  $scope.getPollUsers = function() {
    var completeUsers = [];
    var users = $scope.active.data.relationships.users.data;
    console.log('users');

    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < $scope.active.included.length; j++) {
        if ($scope.active.included[j].id === users[i].id) {
          completeUsers.push($scope.active.included[j]);
        }
      }
    }
    console.log(completeUsers);
    return completeUsers;

  };

}]);