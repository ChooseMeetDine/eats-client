app.controller('mapController', ['$scope', '$http', 'pollService', function($scope, $http, pollService) {
  var restaurantMarkers = {};
  var apiUrl = 'http://128.199.48.244:7000/restaurants';
  //url-id + token to map styles that are called from mapbox
  var mapId = 'gustavsvensson/cin628bnu00vwctnf2rdfbfmv';
  var mapToken = 'pk.eyJ1IjoiZ3VzdGF2c3ZlbnNzb24iLCJhIjoiY2lrOGh5cmc4MDJtb3cwa2djenZzbmwzbiJ9.aKbD4sJfKeFr1GBTtlvOFQ';
  var mapId2 = 'beijar/cin5pab6g00sectnf9c96x1u2';
  var mapToken2 = 'pk.eyJ1IjoiYmVpamFyIiwiYSI6ImNpbjVvbm14OTAwc3N2cW0yNW9qcTJiOHAifQ.fqEQVqMhNvFDasEpkwzz0Q';

  angular.extend($scope, {
    center: {
      lat: 59.91,
      lng: 10.75,
      zoom: 13,
      autoDiscover: true
    },
    markers: restaurantMarkers,
    tiles: {
      name: 'Mapbox',
      url: 'https://api.mapbox.com/styles/v1/{mapid}/tiles/{z}/{x}/{y}?access_token={apikey}',
      options: {
        apikey: mapToken,
        mapid: mapId
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
          iconUrl: 'images/icons/you_marker.png',
          iconSize: [24, 24], // size of the icon
          iconAnchor: [12, 0], // point of the icon which will correspond to marker's location
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
          categories: restaurant.relationships.categories
        }
      };
      //console.log(attributes);
      var marker = {
        lat: restaurant.attributes.lat,
        lng: restaurant.attributes.lng,
        icon: {
          iconUrl: markerType(attributes.extra.categories),
          iconSize:   [52, 52],
          iconAnchor: [26, 52]
        },
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
  //Ugly hack to decide marker type, TODO: redo to a leaflet solution
  //for dynamic marker icons
  function markerType(restaurantExtraData){
    //console.log(restaurantExtraData);
    var data = restaurantExtraData;
    var rest = 'images/icons/rest_marker.png';
    for(i in data){
        var object = data[i];
        for(j in object){
            //TODO: Create a check if key exist n object
            if(object[j].id == "3"){
                rest = 'images/icons/cafe_marker.png';
                break;
                }
            }
        }
    return rest;
  };
//old geo search implementation, saved if we can implement in ang.leaflet
 /**geosearch = new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google()
    }); **/
}]);
