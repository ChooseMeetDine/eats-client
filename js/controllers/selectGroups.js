app.controller('selectGroups', function($scope, $http) {
    var voteMap = {};
            voteMap.user = [];
            voteMap.restaurant = [];
            voteMap.vote = [];
            voteMap.group = [];

        $http({
            methos: 'GET', 
            url:"js/json/get_vote.json"
        }).then(function successCallback(response) {
            $scope.item = response.data;
            var items = response.data.included;

            for(i = 0; i < items.length; i++){
                voteMap[items[i].type].push(items[i]);
            }  
    
        $scope.included = response.data.included;
        var included = response.data.included;
        console.log(included);
    });
});