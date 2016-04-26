app.controller('filterController', ['$scope', 'filterService', function($scope, filterService){
    $scope.toggle = function(categoryId){
        filterService.toggleFilter(categoryId);
    }
}]);