app.controller('mapController', ['$scope', '$http', 'pollService', 'filterService', 'modeService', 'createRestaurantService', '__env', function($scope, $http, pollService, filterService, modeService, createRestaurantService, __env) {
  var restaurantMarkers = [];
  var restaurants = {};
  //url-id + token to map styles that are called from mapbox
  var mapId = 'gustavsvensson/cin628bnu00vwctnf2rdfbfmv';
  var mapToken = 'pk.eyJ1IjoiZ3VzdGF2c3ZlbnNzb24iLCJhIjoiY2lrOGh5cmc4MDJtb3cwa2djenZzbmwzbiJ9.aKbD4sJfKeFr1GBTtlvOFQ';
  var mapId2 = 'beijar/cin5pab6g00sectnf9c96x1u2';
  var mapToken2 = 'pk.eyJ1IjoiYmVpamFyIiwiYSI6ImNpbjVvbm14OTAwc3N2cW0yNW9qcTJiOHAifQ.fqEQVqMhNvFDasEpkwzz0Q';
  var overlays = filterService.overlays;

  leafletConfig = {
    center: {
      lat: 59.91,
      lng: 10.75,
      zoom: 15,
      autoDiscover: true
    },
    markers: restaurantMarkers,
    tiles: {
      name: 'Mapbox',
      url: 'https://api.mapbox.com/styles/v1/{mapid}/tiles/{z}/{x}/{y}?access_token={apikey}',
      options: {
        apikey: mapToken,
        mapid: mapId,
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 19,
        minZoom: 4
      }
    },
    layers: {
      overlays: overlays
    },
    defaults: {
      zoomControlPosition: 'topright',
      locationControlPosition: 'topright',
    }
  }

  // Due to a Chrome error when trying to get user location over HTTP (instead of HTTPS)
  // on the staging server, this code will evaluate __env-variables to determine if user location should
  // be used or not
  if (__env.USE_LOCATION) {
    leafletConfig.events = {
      map: {
        enable: ['locationfound'],
        logic: 'emit'
      }
    }

    leafletConfig.controls = {
      custom: [
        L.control.locate({
          follow: true,
          position: 'topright'
        })
      ]
    }

    $scope.$on('leafletDirectiveMap.locationfound', function(event) {
      restaurantMarkers.push({
        lat: $scope.center.lat,
        lng: $scope.center.lng,
        draggable: false,
        icon: {
          iconUrl: 'images/icons/you_marker.png',
          iconSize: [24, 24], // size of the icon
          iconAnchor: [12, 0], // point of the icon which will correspond to marker's location
        }
      });
    });
  } else {
    // If not using user location - default to Odd Hill coordinates in Malmö
    restaurantMarkers.push({
      lat: 55.607335,
      lng: 13.008678,
      draggable: false,
      icon: {
        iconUrl: 'images/icons/you_marker.png',
        iconSize: [24, 24], // size of the icon
        iconAnchor: [12, 0], // point of the icon which will correspond to marker's location
      }
    });
  }

  // Adds the leaflet config object to $scope
  angular.extend($scope, leafletConfig);

  // Event listener for clicks on map
  $scope.$on('leafletDirectiveMap.click', function(event, args) {
    if ($scope.mode.active === 'CREATE_RESTAURANT') {
      createRestaurantService.setClickedPosition(args.leafletEvent.latlng.lat, args.leafletEvent.latlng.lng);
      modeService.setMode('DEFAULT');
      $scope.dialogs.showAdvanced(args.leafletEvent, 'createRestaurant');
    }
  });

  var fetchRestaurants = function() {
    $http({
      method: 'GET',
      url: __env.API_URL + '/restaurants',
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
          categories: restaurant.relationships.categories
        }
      };
      //console.log(attributes);
      var marker = {
        lat: restaurant.attributes.lat,
        lng: restaurant.attributes.lng,
        icon: {
          iconUrl: markerType(attributes.extra.categories),
          iconSize: [52, 52],
          iconAnchor: [26, 52]
        },
        message: "<div ng-include=\"\'html/marker.html\'\">",
        draggable: false,
        getMessageScope: function() { // "gives" a scope to the template
          scope = $scope.$new();
          angular.extend(scope, this.attributes); // adds attributes to scope, to let the template reach the data
          return scope;
        },
        attributes: attributes,
      }

      for (var i = 0; i < attributes.extra.categories.length; i++) {
        //console.log(attributes.name);
        var markerCopy = angular.copy(marker);
        markerCopy.layer = attributes.extra.categories[i].data.id;
        //console.log(attributes.extra.categories[i].data.id);
        restaurantMarkers.push(markerCopy);
      }
      restaurants[restaurant.id] = attributes;

    }
  };

  fetchRestaurants();

  $scope.addRestaurantToPoll = function(restaurantId) {
    pollService.addRestaurantToForm(restaurants[restaurantId]);
  };

  $scope.openSlideMenu = function(restaurantId) {
    angular.element(document.getElementById('moreInfoMenu')).scope().toggleMoreInfoMenu();
    angular.element($('#moreInfoSlider')).scope().createInfoScopes(restaurants[restaurantId]);
  };
  //Ugly hack to decide marker type, TODO: redo to a leaflet solution
  //for dynamic marker icons
  function markerType(restaurantExtraData) {
    //console.log(restaurantExtraData);
    var data = restaurantExtraData;
    var rest = 'images/icons/rest_marker.png';
    for (i in data) {
      var object = data[i];
      for (j in object) {
        //TODO: Create a check if key exist n object
        if (object[j].id == "11") {
          rest = 'images/icons/cafe_marker.png';
          break;
        }
      }
    }
    return rest;
  };
}]);
