/**
 * Controller for categories in moreInfo tab
 */
app.controller('getCategory', ['$scope', '$http', '$window', '__env', function($scope, $http, $window, __env) {
    $scope.restaurants = [];

    getRestaurantsAndCategories();
    //Get the restaurant and it's categories
    function getRestaurantsAndCategories(){
        $http({
            method: 'GET',
            url: __env.API_URL + '/restaurants',
        }).then(function(response) {
            extractCategoriesFromRestaurants(response.data);
        }).catch(function(error) {
           console.log("Error, cannot load restaurants!");
        });
    }

    // Extracts the categories from restaurants in resultData
    function extractCategoriesFromRestaurants(resultData){
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
            $scope.restaurants.push(restaurantCategories);
        }
    }
}]);
