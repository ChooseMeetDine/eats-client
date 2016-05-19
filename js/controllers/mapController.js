app.controller('mapController', ['$scope', '$http', 'pollService', 'filterService', 'modeService', 'createRestaurantService', '__env', function($scope, $http, pollService, filterService, modeService, createRestaurantService, __env) {
  var restaurantMarkers = [];
  var restaurants = {};
  //url-id + token to map styles that are called from mapbox
  var mapId = 'gustavsvensson/cin628bnu00vwctnf2rdfbfmv';
  var mapToken = 'pk.eyJ1IjoiZ3VzdGF2c3ZlbnNzb24iLCJhIjoiY2lrOGh5cmc4MDJtb3cwa2djenZzbmwzbiJ9.aKbD4sJfKeFr1GBTtlvOFQ';
  var mapId2 = 'beijar/cin5pab6g00sectnf9c96x1u2';
  var mapToken2 = 'pk.eyJ1IjoiYmVpamFyIiwiYSI6ImNpbjVvbm14OTAwc3N2cW0yNW9qcTJiOHAifQ.fqEQVqMhNvFDasEpkwzz0Q';
  var overlays = filterService.overlays;
  var userMarker;
  var createRestaurantMarker;
  var createRestaurantMarkerNew;

  // ------------------------------- //
  //        MAP CONFIGURATION        //
  // ------------------------------- //
  var mapConfig = {
    center: {
      lat: 55.60494792571626,
      lng: 12.999229431152344,
      zoom: 14
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
    // events: {
    //   map: {
    //     enable: ['locationfound', 'popupopen'],
    //     logic: 'emit'
    //   }
    // },
    defaults: {
      zoomControlPosition: 'topright',
      locationControlPosition: 'topright'
    },
    controls: {
      custom: [
        L.control.locate({
          follow: false,
          position: 'topright',
          // keepCurrentZoomLevel: false,
          locateOptions: {
            maxZoom: 16
          },
          drawCircle: true,
          circleStyle:{
            opacity: 0,
            fillOpacity: 0
          },
          markerStyle: {
            // color: '#FC8428',
            color: '#000',
            weight: 20,
            opacity: 0.8,
            // fillColor: '#FC8428',
            fillColor: 'white',
            fillOpacity: 1,
            clickable: false
          }
        }),
          L.Control.geocoder({
            position: 'topright'
//        }),
//          L.Routing.control({
//            position: 'bottomleft',              
//              waypoints: [
//                  L.latLng(55.607335, 13.008678)
//              ],
//              routeWhileDragging: true,
//              geocoder: L.Control.Geocoder.nominatim()
          })
      ]
    }
  }

  // Due to a Chrome error when trying to get user location over HTTP (instead of HTTPS)
  // on the staging server, this code will evaluate __env-variables to determine if auto discover of
  // user location should be used or not
  // if (__env.USE_LOCATION) {
  //   mapConfig.center.autoDiscover = true;
  // } else {
  //   // If not using user location - default to Odd Hill coordinates in Malmö
  //   userMarker = {
  //     lat: 55.607335,
  //     lng: 13.008678,
  //     draggable: false,
  //     icon: {
  //       iconUrl: 'images/icons/you_marker.png',
  //       iconSize: [24, 24], // size of the icon
  //       iconAnchor: [12, 0], // point of the icon which will correspond to marker's location
  //     }
  //   };
  //   restaurantMarkers.push(userMarker);
  // }

  // Adds the leaflet config object to $scope
  angular.extend($scope, mapConfig);


  // ------------------------------- //
  //       MAP EVENT LISTENERS       //
  // ------------------------------- //

  // Event listener for location found
  // Draws a marker on map where location was found
  // $scope.$on('leafletDirectiveMap.locationfound', function(event) {
  //   if (!userMarker) {
  //     userMarker = {
  //       lat: $scope.center.lat,
  //       lng: $scope.center.lng,
  //       draggable: false,
  //       icon: {
  //         iconUrl: 'images/icons/you_marker.png',
  //         iconSize: [24, 24], // size of the icon
  //         iconAnchor: [12, 0], // point of the icon which will correspond to marker's location
  //       }
  //     };
  //     restaurantMarkers.push(userMarker);
  //   } else {
  //     userMarker.lat = $scope.center.lat;
  //     userMarker.lng = $scope.center.lng;
  //   }
  // });

  // Event listener for clicks on map
  $scope.$on('leafletDirectiveMap.click', function(event, args) {
    if ($scope.mode.active === 'CREATE_RESTAURANT') {
      if (!createRestaurantMarker) {
        createRestaurantMarker = {
          lat: args.leafletEvent.latlng.lat,
          lng: args.leafletEvent.latlng.lng,
          draggable: true,
          focus: true,
          id: "CREATE_RESTAURANT_MARKER",
          /*message: "<span ng-include=\"\'html/createRestaurantMarker.html\'\"></span>",*/
          icon: {
            iconUrl: 'images/icons/create_restaurant_marker.png',
            iconSize: [24, 24], // size of the icon
            iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
          },
          label:{
              message: "<span ng-include=\"\'html/createRestaurantMarker.html\'\"></span>",
              options: {
                  noHide: true
              }
          },
          getLabelScope: function(){return $scope}
          }
        restaurantMarkers.push(createRestaurantMarker);
      }else{
          restaurantMarkers.pop(createRestaurantMarker);
          restaurantMarkers.push(createRestaurantMarker);
          createRestaurantMarker.lat = args.leafletEvent.latlng.lat;
          createRestaurantMarker.lng = args.leafletEvent.latlng.lng;
      }
      createRestaurantService.setClickedPosition(createRestaurantMarker);
      $scope.center.lat = args.leafletEvent.latlng.lat;
      $scope.center.lng = args.leafletEvent.latlng.lng;
      modeService.setMode('DEFAULT');      
      
    }
  });
  $scope.$on('leafletDirectiveMarker.dragend', function(e, args){
        console.log(args);
        if(args.model.id === "CREATE_RESTAURANT_MARKER"){
            console.log(args.model.id);
            console.log(args.model.lat);
            console.log(args.model.lng);
            createRestaurantMarker.lat = args.model.lat;
            createRestaurantMarker.lng = args.model.lng;
            $scope.center.lat = args.model.lat;
            $scope.center.lng = args.model.lng;
        }
       });
  $scope.deleteMarker = function(){
      restaurantMarkers.pop(createRestaurantMarker);
  }
  // Event listener for clicks on markers - centers map on marker
  $scope.$on('leafletDirectiveMap.popupopen', function(event, args) {
    $scope.center.lat = args.leafletEvent.popup._latlng.lat;
    $scope.center.lng = args.leafletEvent.popup._latlng.lng;
  });


  // ------------------------------- //
  //          CREATE MARKERS         //
  // ------------------------------- //

  // Fetches all restaurants from the API
  var fetchRestaurants = function() {
    $http({
      method: 'GET',
      url: __env.API_URL + '/restaurants',
      /*headers: {'x-access-token' : $window.localStorage['jwtToken']}*/
    }).then(function(response) {
      createMarkers(response.data);
    }, function(response) {
      console.log("Error, cannot load restaurants!");
    });
  }

  // Creates one marker per restaurant, from the API-request
  // Result data structure: {restaurantId:{all data for one restaurant}}
  var createMarkers = function(resultData) {
    var items = resultData.data;

    for (var k in items) {
      var restaurant = items[k];

      if(!restaurant.relationships.categories){ //Skip all restaurants without categories
        continue;
      }

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
      var marker = {
        lat: restaurant.attributes.lat,
        lng: restaurant.attributes.lng,
        icon: {
          iconUrl: markerType(attributes.extra.categories),
          iconSize: [52, 52],
          iconAnchor: [26, 52]
        },
        message: "<span ng-include=\"\'html/marker.html\'\"></span>",
        draggable: false,
        getMessageScope: function() { // "gives" a scope to the template
          scope = $scope.$new();
          angular.extend(scope, this.attributes); // adds attributes to scope, to let the template reach the data
          return scope;
        },
        attributes: attributes,
      }

      for (var i = 0; i < attributes.extra.categories.length; i++) {
        var markerCopy = angular.copy(marker);
        markerCopy.layer = attributes.extra.categories[i].data.id;
        restaurantMarkers.push(markerCopy);
      }
      restaurants[restaurant.id] = attributes;

    }

    console.log($scope);
  };

  //Ugly hack to decide marker type, TODO: redo to a leaflet solution
  //for dynamic marker icons
  function markerType(restaurantExtraData) {
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

  // Fetches the restaurants and creates markers
  fetchRestaurants();


  // ------------------------------- //
  //     OTHER $SCOPE FUNCTIONS      //
  // ------------------------------- //

  $scope.addRestaurantToPoll = function(restaurantId) {
    pollService.addRestaurantToForm(restaurants[restaurantId]);
  };

  $scope.openSlideMenu = function(restaurantId) {
    angular.element(document.getElementById('moreInfoMenu')).scope().toggleMoreInfoMenu();
    angular.element($('#moreInfoSlider')).scope().createInfoScopes(restaurants[restaurantId]);
  };
}]);
