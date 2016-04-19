app.controller('getRestaurants', function($scope, $http, $window) {    
    var start = new Date().getTime();
    var restaurantResult = {};    
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
                console.log('Restaurang: ' + name);
                //console.log(response.data.data[i].relationships.categories);
                for(var j = 0; j < response.data.data[i].relationships.categories.length; j++){
                    console.log('kategori id ' + response.data.data[i].relationships.categories[j].data.id);
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
                    "categories": [
                        {
                            "category": undefined
                        }
                    ] //restaurant.relationships.categories[0].data.id
                }
            }
            for(var x in k){
                //console.log('test data: ' + restaurant.relationships.categories[x].data.id);
                console.log('--------------');
            }
            counter++;
            var id = restaurant.id;
            restaurantResult[counter] = restaurantData;
        }
        //Create list where restaurant categories are saved.
        var catObj = {
            "id": undefined,
            "category_id": [
                {
                    "id": undefined
                }
            ]
        }
        var categoryList = [];
        var categories = [];
        for(var k in items){
            var restaurant = items[k];
            catObj.id = restaurant.id;
            categories.push(restaurant.relationships.categories);
            //console.log(restaurant.relationships.categories);
            //console.log(categories);
            categoryList.push(catObj);
            
        }
        
        console.log('kategori id ' + categoryList[0]);
      
        //rätt utdata för id av kategori console.log(categoryList[0].category_id.id);
        console.log('------------');
        //Loop through categories and append to result object.
        for(var i = 0; i < categories.length; i++){
            catObj.categories = categories[i];
            console.log(categories[i]);
            for(var j = 0; j < categories[i].length; j++){
                console.log('restaurang ' + [i] + ' och id ' + categories[i][j].data.id);
                console.log(categoryList[i].category_id.push(categories[i][j].data.id));
                //categories.push(categories[i][j].data.id);
            }
            
        }
        //console.log('data ska sparas här ' + restaurantResult[0].extra.categories);
        console.log('final object');
        console.log(categoryList);
        placeMarker(restaurantResult);
        
        
        var end = new Date().getTime();
        var time = end - start;
        console.log("Exec time = " + time);
        
        
        $scope.createInfoScopes = function(id){
            $scope.content = restaurantResult[id];
        }       
    }    
});
