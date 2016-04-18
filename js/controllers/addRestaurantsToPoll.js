app.controller('addRestaurantsToPoll', ['$scope', 'pollService', 'modeService', function($scope, pollService, modeService) {
    $scope.poll = pollService.getForm();
    $scope.restaurants = [{
        name: "Broderstugan"
    }];
    // $scope.restaurants = pollService.getForm().restaurants;

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

}]);