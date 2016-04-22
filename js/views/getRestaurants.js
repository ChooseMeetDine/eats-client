app.controller('getRestaurants', function($scope, $http, $window) {    
    var start = new Date().getTime();
    var restaurantResult = [];    
    var link = 'http://128.199.48.244:3000/restaurants';
    
    getRestaurant(link);
    
    function getRestaurant(url){
        var link = url;
        $http({
            method: 'GET',
            url: link,
            /*headers: {'x-access-token' : $window.localStorage['jwtToken']}*/
        }).then(function successCallback(response) {
            //console.log(response);
            var categoryList = [];
            for(var i = 0; i < response.data.data.length; i++){
                name = response.data.data[i].attributes.name;
                //console.log('Restaurang: ' + name);
                //console.log(response.data.data[i].relationships.categories);
                for(var j = 0; j < response.data.data[i].relationships.categories.length; j++){
                    //console.log('kategori id ' + response.data.data[i].relationships.categories[j].data.id);
                    categoryList.push(response.data.data[i].relationships.categories[j].data.id);
                }
                /*
                for(var j = 0; j < response.data.included.length; j++){
                    category = response.data.included[j].attributes.name;
                    console.log('     ' + name + ' serverar ' + category);
                    //categoryList.push(category);
                }*/
                //console.log(restaurant);
                //console.log(response.data.included);
            }
            //console.log(categoryList);
            resultRestaurant(response.data);
            
        }, function errorCallback(response) {
           console.log("Error, cannot load restaurants!");
        });
    }
     
    //This function takes the result and creates a restaurantData object and pushes it to restaurantResult array.
    function resultRestaurant(resultData){
        var counter = -1;
        var items = resultData.data;
        for(var k in items){
            var restaurant = items[k];
            var restaurantData = {
                "id" : restaurant.id,
                "name": restaurant.attributes.name,
                "lat": restaurant.attributes.lat,
                "lng":  restaurant.attributes.lng,
                "photo": restaurant.attributes.photo,
                "rating":  restaurant.attributes.rating,
                "extra": {
                    "info":  restaurant.attributes.info,
                    "pricerate":  restaurant.attributes.priceRate,
                    "number_votes":  restaurant.attributes.number_votes,
                    "number_votes-won":  restaurant.attributes.number_won_votes,
                    "categories":restaurant.relationships.categories
                }
            }
            //Push categories array from resultData to array in restaurantData object
            //restaurantData.extra.categories.push(restaurant.relationships.categories)
            for (var i in restaurantData.extra.categories) {
                //console.log(restaurantData.extra.categories[i].data.id);
            }
            counter++;
            restaurantResult[counter] = restaurantData;
            var id = restaurant.id;
        }
        
         
        console.log(restaurantResult[0].extra.categories[0].data.id);
        
        $scope.markerFilter = function(isTrue, categoryNum){
            //alert(isTrue);
            //alert(categoryNum);
            /*
            if(isTrue && categoryNum){
                for(var restaurant in restaurantResult){
                    //console.log(restaurantResult[restaurant].extra.categories);
                    for(var i = 0; i < restaurantResult[restaurant].extra.categories.length; i++){
                       //console.log(restaurantResult[restaurant].extra.categories[i][1].data);
                       for(var j = 0; j < restaurantResult[restaurant].extra.categories[i].length; j++){
                           //console.log(restaurantResult[restaurant].extra.categories[i][j].data);
                           var categoryId = restaurantResult[restaurant].extra.categories[i][j].data.id;
                           //console.log(categoryId);
                           if(categoryId == categoryNum){
                               var index = restaurantResult.indexOf(restaurantResult[restaurant]);
                               console.log(index + ' this is the index');
                               //alert(categoryNum);
                               restaurantResult.splice(index, 1);
                               placeMarker(restaurantResult);
                           }
                       }
                    }
                }
            }else{
                placeMarker(restaurantResult);
            }*/
            
        }
        
        //placeMarker(restaurantResult);
        
        var end = new Date().getTime();
        var time = end - start;
        //console.log("Exec time = " + time);
        
        //console.log($scope.filterCheckbox);
        
        $scope.createInfoScopes = function(id){
            $scope.content = restaurantResult[id];
        }       
    }    
});
