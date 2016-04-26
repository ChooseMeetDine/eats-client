app.controller('getRestaurants', function($scope, $http, $window) {
  var start = new Date().getTime();
  var restaurantResult = [];
  //result data structure: {restaurantId:{all data for one restaurant}}
  //var restaurantResult = {};
  var link = 'http://128.199.48.244:3000/restaurants';

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

  //This function takes the result and creates a restaurantData object and pushes it to restaurantResult array.
  function resultRestaurant(resultData) {
    //console.log('called');
    var counter = -1;
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
            "pricerate": restaurant.attributes.priceRate,
            "number_votes": restaurant.attributes.number_votes,
            "number_votes-won": restaurant.attributes.number_won_votes,
            "categories": restaurant.relationships.categories
          }
        }

        counter++;
        restaurantResult[counter] = restaurantData;
        var id = restaurant.id;
      }

    //console.log(restaurantResult);
    //calls marker function from maps.js to create rest.markers on map
    //placeMarker(restaurantResult);

    /**
        var end = new Date().getTime();
        var time = end - start;
        //console.log("Exec time = " + time);

    */

    $scope.createInfoScopes = function(id) {
      $scope.content = restaurantResult[id];
    }
  }
});
