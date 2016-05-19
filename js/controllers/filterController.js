/**
 * Controller for filtering restaurants on the map
 */
app.controller('filterController', ['$scope', 'filterService', function($scope, filterService){
  //Sets all checbox to true separately
  $scope.truthy = [true, true, true, true, true, true, true, true, true, true, true, true, true, true];

  //Category array with te purpose of determinating if category has been clicked.
  categoryClicked = [];

  $scope.toggle = function(categoryId){

    //Toggle filter once
    filterService.toggleFilter(categoryId);

    //function set to array object that sets all positions of array to same value.
    Array.prototype.setAll = function(value){
        for(var i = 0; i < this.length; ++i){
            this[i] = value;
        }
    }

    //Condition that removes all filters first time user clicks on category
    if($scope.truthy[categoryId-1] == false && categoryClicked.indexOf(categoryId) == -1 && categoryClicked.length < 1){
      $scope.truthy.setAll(false);
      $scope.truthy[categoryId-1] = true;

      categoryClicked.push(categoryId);//push category

      for(var i = 0; i < $scope.truthy.length; i++){
        if (i !== 10) {
          filterService.toggleFilter(i+1);
        }
      }
      
    }
  }
}]);
