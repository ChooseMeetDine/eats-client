app.controller('filterController', ['$scope', 'filterService', function($scope, filterService){
    //Sets all checbox to true separately
    $scope.truthy = [true, true, true, true, true, true, true, true, true, true];
   
    $scope.toggle = function(categoryId){
        filterService.toggleFilter(categoryId);
    }
   
}]);