app.controller('filterController', ['$scope', 'filterService', function($scope, filterService){
    $scope.toggle = function(categoryId){
        filterService.toggleFilter(categoryId);
    }
    //Sets all checbox to true separately
    $scope.truthy = [true, true, true, true, true, true, true, true, true, true];
}]);