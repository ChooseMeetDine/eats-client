//TODO: TEST THIS API FUNCTION, MAYBE RESTRUCTURE RESULT DATA FOR APP.USAGE
app.controller('getUserId', function($scope, $http) {
	var userIdResult = {}; 
    
	$scope.getUserId = function(ID){
		var id = ID;
		var link = 'http://http://128.199.48.244:3000/users/'+new String(id);
	
		$http({
		  method: 'GET',
		  url: link;
		}).then(function successCallback(response) {
			resultUser(response.data);
		}, function errorCallback(response) {
		   console.log("error");
		});
		
		function resultUser(response){
			userIdResult = response;
			console.log(userIdResult);
			return userIdResult;
		}
	}
});
			   