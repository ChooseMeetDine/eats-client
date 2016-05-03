app.controller('getRestaurants', ['$scope', '$http', '$window', '__env', function($scope, $http, $window, __env) {
  var start = new Date().getTime();
  //result data structure: {restaurantId:{all data for one restaurant}} 
  var restaurantResult = {};
  var link = __env.API_URL + '/restaurants';

  getRestaurant(link);

  function getRestaurant(url) {
    var link = url;
    $http({
      method: 'GET',
      url: link,
      /*headers: {'x-access-token' : $window.localStorage['jwtToken']}*/
    }).then(function successCallback(response) {
      resultRestaurant(response.data);
    }, function errorCallback(response) {
      console.log("Error, cannot load restaurants!");
    });
  }

  function resultRestaurant(resultData) {
    var items = resultData.data;
    for (var k in items) {
      var restaurant = items[k];
      var restaurantData = {
        "id": restaurant.id,
        "name": restaurant.attributes.name,
        "lat": restaurant.attributes.lat,
        "lng": restaurant.attributes.lng,
        "photo": restaurant.attributes.photo,
        "rating": restaurant.attributes.rating,
        "extra": {
          "info": restaurant.attributes.info,
          "pricerate": restaurant.attributes.pricerate,
          "number_votes": restaurant.attributes.number_votes,
          "number_votes-won": restaurant.attributes.number_won_votes,
          "categories": restaurant.relationships.data
        }
      }
      var id = restaurant.id;
      restaurantResult[id] = restaurantData;
    }
    //console.log(restaurantResult);
    //calls marker function from maps.js to create rest.markers on map
    // placeMarker(restaurantResult);

    /**
    var end = new Date().getTime();
    var time = end - start;
    console.log("Exec time = " + time); **/


    $scope.createInfoScopes = function(id) {
      $scope.content = restaurantResult[id];
    }
  }
}]);
