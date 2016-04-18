app.controller('activePolls', ['$scope', 'pollService', function($scope, pollService) {
    $scope.polls = pollService.getAll();
    $scope.switchActivePoll = function(poll) {
        pollService.setActiveId(poll.data.id);
    }
}]);