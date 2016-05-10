app.controller('filterController', ['$scope', 'filterService', function($scope, filterService){
    //Sets all checbox to true separately
    $scope.truthy = [true, true, true, true, true, true, true, true, true, true];
    //console.log($scope.truthy);
    $scope.toggle = function(categoryId){
        //console.log(categoryId)
        //console.log($scope.truthy);
        
        filterService.toggleFilter(categoryId);
        
        Array.prototype.allValuesSame = function(){
            for(var i = 1; i < this.length; i++){
                if(this[i] !== this[0]){
                    return false;
                }
            }
            return true;
        }
        
        Array.prototype.setAll = function(value){
            //var i, n = this.length;
            for(var i = 0; i < this.length; ++i){
                this[i] = value;
            }
        }
        
        
        if($scope.truthy[categoryId-1] == false){
            console.log('bajs');
            $scope.truthy.setAll(false);
            $scope.truthy[categoryId-1] = true;
            for(var i = 0; i < $scope.truthy.length; i++){
                 filterService.toggleFilter(i+1);
            }
            
            //console.log($scope.truthy);
        }
        /*
        var copyTruthy = $scope.truthy;
        copyTruthy.slice(categoryId-1,  )*/
        var list = [false,false,true,false,false];
        Array.prototype.except = function(val){
            return this.filter(function(x) { return x !== val; }); 
        }
        console.log(list.except(true));
    }
   
   
}]);