app.controller('getCategory', function($scope, $http, $window) {
    var start = new Date().getTime();
    //result data structure: {restaurantId:{all data for one restaurant}}
    var categoryResult = [];
    var link = 'http://128.199.48.244:7000/restaurants';

    getCategory(link);

    function getCategory(url){
        var link = url;
        $http({
            method: 'GET',
            url: link,
            /*headers: {'x-access-token' : $window.localStorage['jwtToken']}*/
        }).then(function successCallback(response) {
            resultCategory(response.data);
        }, function errorCallback(response) {
           console.log("Error, cannot load restaurants!");
        });
    }

    function resultCategory(resultData){
        var items = resultData.data;
        for(var item in items){
            var restaurant = items[item];
            var restaurantCategories = {
                id : restaurant.id,
                categories : []
            }
            for(var i = 0; i < restaurant.relationships.categories.length; i++){
                restaurantCategories.categories.push(restaurant.relationships.categories[i].data.id);
            }
            categoryResult.push(restaurantCategories);
        }

        $scope.restaurants = categoryResult;

    }
});
