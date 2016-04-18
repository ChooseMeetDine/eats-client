//TODO: TEST THIS API FUNCTION, MAYBE RESTRUCTURE RESULT DATA FOR APP.USAGE
app.controller('getRestaurantId', function($scope, $http) {
	var restaurantIdResult = {}; 
    
	$scope.getRestaurantId = function(ID){
		var id = ID;
		var link = 'http://http://128.199.48.244:3000/restaurants/'+new String(id);
	
		$http({
		  method: 'GET',
		  url: link;
		}).then(function successCallback(response) {
			resultRestaurantId(response.data);
		}, function errorCallback(response) {
		   console.log("error");
		});
		
		function resultRestaurantId(response){
			restaurantIdResult = response;
			console.log(restaurantIdResult);
			return restaurantIdResult;
		}
	}
});
			   