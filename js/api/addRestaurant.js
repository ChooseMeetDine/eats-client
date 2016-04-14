app.controller('addRestaurant', function($scope, $http, $window) {
    var marker;
        $scope.lat; 
        $scope.lng;
        $scope.cats = [
            "13",
            "33"
        ];
        $scope.selected = [];
        $scope.toggle = function (cat, list) {
            var idx = list.indexOf(cat);
            if (idx > -1) list.splice(idx, 1);
            else list.push(cat);
        };
        $scope.exists = function (cat, list) {
            return list.indexOf(cat) > -1;
        };        
    $scope.placeMarkerOnClick = function(){  
                map.once('click', function(e){
                    if(marker){
                        map.removeLayer(marker);    
                    }
                    marker = L.marker(e.latlng).addTo(map);

                    $scope.lat = e.latlng.lat; 
                    $scope.lng = e.latlng.lng;

                    console.log($scope.lat);
                    console.log($scope.lng); 
                    displayPopup();
                }
            )};
        $scope.removeMarker = function(){
            if(marker){
                map.removeLayer(marker);
            }
        }
    
        $scope.regRestaurant = function(){
            restaurant = {
                'name' : $scope.name,
                'categories' : $scope.selected,
                'priceRate' : $scope.priceRate,
                'rating' : $scope.rating,
                'info' : $scope.info,
                'photo' : $scope.photo,
                'lat' : $scope.lat,
                'lng' : $scope.lng,
                /*
                'name' : $scope.name,
                'categories' : [$scope.category],
                'priceRate' : $scope.priceRate,
                'rating' : $scope.rating,
                'info' : $scope.info,
                'photo' : $scope.photo,
                'lng' : $scope.lng,
                'lat' : $scope.lat  */
            }
            console.log(restaurant);
            $http({
                method: 'POST',
                url: 'http://128.199.48.244:3000/restaurants',
                headers: {'Content-Type': 'application/json'},
                data: restaurant
            }).then(function successCallback(response){                
                $scope.regRestaurant = response; 
                $window.location.reload();
            }, function errorCallback(){
                $scope.regRestaurant = "error";
            });
        };
    
$scope.hidePopup = function(){
        $('.addRestaurantPopup').addClass('display-none-addRestaurantPopup');
        $('.md-dialog-container').addClass('display-none-md-dialog-container');
        $('.md-dialog-backdrop').addClass('display-none-md-dialog-backdrop');
        $('.md-scroll-mask').addClass('display-none-md-scroll-mask');
    }
 
 var displayPopup = function(){
        $('.addRestaurantPopup').removeClass('display-none-addRestaurantPopup');
        $('.md-dialog-container').removeClass('display-none-md-dialog-container');
        $('.md-dialog-backdrop').removeClass('display-none-md-dialog-backdrop');
        $('.md-scroll-mask').removeClass('display-none-md-scroll-mask');
    }
       
    });
                   
                