app.controller('mapController', ['$scope', '$http', 'pollService', function($scope, $http, pollService) {
  var restaurantMarkers = {};
  var apiUrl = 'http://128.199.48.244:3000/restaurants';

  angular.extend($scope, {
    center: {
      lat: 59.91,
      lng: 10.75,
      zoom: 12,
      autoDiscover: true
    },
    markers: restaurantMarkers,
    tiles: {
      name: 'Mapbox',
      url: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={apikey}',
      options: {
        apikey: 'pk.eyJ1Ijoid2lpZ29sYXMiLCJhIjoiY2lreHYxejNvMDA0NndsbTRmejl4NndqMSJ9.5hfLbJnXbAsfsPRT3V4W4Q',
        mapid: 'wiigolas.p7idlkkp'
      }
    },
    events: {
      map: {
        enable: ['locationfound'],
        logic: 'emit'
      }
    },
    defaults: {
      zoomControlPosition: 'topright',
      locationControlPosition: 'topright'
    },
    controls: {
      custom: [
        L.control.locate({
          follow: true,
          position: 'topright'
        })
      ]
    }
  });

  $scope.$on('leafletDirectiveMap.locationfound', function(event) {
    angular.extend($scope.markers, {
      userMarker: {
        lat: $scope.center.lat,
        lng: $scope.center.lng,
        draggable: false,
        focus: true,
        icon: {
          iconUrl: 'images/icons/marker-icon-red.png',
          iconSize: [25, 41], // size of the icon
          iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
        }
      }
    });
  });

  var fetchRestaurants = function() {
    $http({
      method: 'GET',
      url: apiUrl,
      /*headers: {'x-access-token' : $window.localStorage['jwtToken']}*/
    }).then(function successCallback(response) {
      createMarkers(response.data);
    }, function errorCallback(response) {
      console.log("Error, cannot load restaurants!");
    });
  }

  //result data structure: {restaurantId:{all data for one restaurant}} 
  var createMarkers = function(resultData) {
    var items = resultData.data;

    for (var k in items) {
      var restaurant = items[k];
      var attributes = {
        id: restaurant.id,
        name: restaurant.attributes.name,
        lat: restaurant.attributes.lat,
        lng: restaurant.attributes.lng,
        photo: restaurant.attributes.photo,
        rating: restaurant.attributes.rating,
        extra: {
          info: restaurant.attributes.info,
          priceRate: restaurant.attributes.pricerate,
          numberVotes: restaurant.attributes.number_votes,
          numberVotesWon: restaurant.attributes.number_won_votes,
          categories: restaurant.relationships.data
        }
      };
      var marker = {
        lat: restaurant.attributes.lat,
        lng: restaurant.attributes.lng,
        message: "<div ng-include=\"\'html/marker.html\'\">",
        focus: true,
        draggable: false,
        getMessageScope: function() { // "gives" a scope to the template
          scope = $scope.$new();
          angular.extend(scope, this.attributes); // adds attributes to scope, to let the template reach the data
          return scope;
        },
        attributes: attributes
      }

      restaurantMarkers[restaurant.id] = marker;
    }
    //console.log(restaurantResult);
    //calls marker function from maps.js to create rest.markers on map
    // placeMarker(restaurantResult);

    // $scope.createInfoScopes = function(id){
    //     $scope.content = restaurantResult[id];
    // }       
  };
  fetchRestaurants();

  $scope.addRestaurantToPoll = function(restaurantId) {
    pollService.addRestaurantToForm(restaurantMarkers[restaurantId]);
  };

  $scope.openSlideMenu = function(restaurantId) {
    angular.element(document.getElementById('moreInfoMenu')).scope().toggleMoreInfoMenu();
    angular.element($('#moreInfoSlider')).scope().createInfoScopes(restaurantMarkers[restaurantId].attributes);
  };
}]);
