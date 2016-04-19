app.controller('addRestaurantsToPoll', ['$scope', 'pollService', 'modeService', function($scope, pollService, modeService) {
    $scope.form = pollService.getForm();

    $scope.remove = function($chip) {
        pollService.removeRestaurantFromForm($chip);
    };

    $scope.add = function() {
        pollService.addRestaurantToForm({
            data: {
                id: 12,
                attributes: {
                    name: 'Whopii'
                }
            }
        })
    }

    $scope.done = function() {
        $scope.swap('createPoll'); //Hide this popup and show createPoll
    }
}]);