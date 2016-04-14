app.controller('getVotes', function($scope, $http) {

        var currentDate = new Date();
        $scope.displayDate = currentDate.getTime();

        var voteMap = {};
            voteMap.user = [];
            voteMap.restaurant = [];
            voteMap.vote = [];
            voteMap.group = [];

        $http({
            methos: 'GET', 
            url:"http://128.199.48.244:3000/polls"
        }).then(function successCallback(response) {
            $scope.item = response.data;
            var items = response.data.included;
            console.log(items);
            console.log(response);

            for(i = 0; i < items.length; i++){
                voteMap[items[i].type].push(items[i]);
            }
            
            $scope.included = voteMap;
            var expire = response.data.data.attributes.expires;
            $scope.expireDate = new Date(expire).getTime();
        
        }, function errorCallback(response) {
            console.log("shit happend");
        });
    });