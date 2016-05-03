app.controller('addRestaurant', ['$scope', '$http', '$window', 'modeService','createRestaurantService', function($scope, $http, $window, modeService,createRestaurantService) {

  $scope.form = createRestaurantService.getForm();

  $scope.getLocationOnMap = function() {
    modeService.setMode('CREATE_RESTAURANT');
    $scope.hide();
  };

  $scope.regRest = function() {
    var restaurant = {
      'name': $scope.form.data.name,
      'rating': $scope.form.data.rating,
      'info': $scope.form.data.adress,
      'lat': $scope.form.data.lat,
      'lng': $scope.form.data.lng,
    }
    var categories = [];
    for (let prop in $scope.form.data.categories) {
      if($scope.form.data.categories[prop]){
        categories.push('' + (parseInt(prop) +1));
      }
    }
    restaurant.categories = categories;
    $http({
      method: 'POST',
      url: 'http://128.199.48.244:7000/restaurants',
      headers: {
        'Content-Type': 'application/json'
      },
      data: restaurant
    }).then(function(response) {
      $scope.error = null;
      createRestaurantService.clearForm();
      $window.location.reload();
    }).catch(function(error) {
      $scope.error = error.data.error;
    });
  };
}]);
