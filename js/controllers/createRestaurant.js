app.controller('createRestaurant', ['$scope', '$http', '$window', 'modeService', 'createRestaurantService', '__env', function($scope, $http, $window, modeService, createRestaurantService, __env) {
  $scope.form = createRestaurantService.getForm();
  $scope.getLocationOnMap = function() {
    modeService.setMode('CREATE_RESTAURANT');
  };
    $scope.form.data.rating = 1; 
    $scope.regRest = function() {
    var restaurant = {
      'name': $scope.form.data.name,
      'rating': $scope.form.data.rating,
      'info': $scope.form.data.info,
      'lat': $scope.form.data.marker.lat,
      'lng': $scope.form.data.marker.lng,
      'photo': $scope.form.data.photo
    }
    
    var categories = [];
    for (var prop in $scope.form.data.categories) {
        if ($scope.form.data.categories[prop]) {
        categories.push('' + (parseInt(prop) + 1));
        }
    }
    restaurant.categories = categories;
    $http({
      method: 'POST',
      url: __env.API_URL + '/restaurants',
      headers: {
        'Content-Type': 'application/json'
      },
      data: restaurant
    }).then(function(response) {
      $scope.error = null;
      $window.location.reload();
    }).catch(function(error) {
      $scope.error = error.data.error;
    });
  };
}]);