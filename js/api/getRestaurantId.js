//TODO: TEST THIS API FUNCTION, MAYBE RESTRUCTURE RESULT DATA FOR APP.USAGE
// Not sure if this needs to be in a angular controller, if only called by other js-files
app.controller('getRestaurantId', ['$scope', '$http', '__env', function($scope, $http, __env) {
  var restaurantIdResult = {};

  $scope.getRestaurantId = function(ID) {
    var id = ID;
    var link = __env.API_URL + '/restaurants/' + new String(id);

    $http({
      method: 'GET',
      url: link
    }).then(function successCallback(response) {
      resultRestaurantId(response.data);
    }, function errorCallback(response) {
      console.log("error");
    });

    function resultRestaurantId(response) {
      restaurantIdResult = response;
      console.log(restaurantIdResult);
      return restaurantIdResult;
    }
  }
}]);
