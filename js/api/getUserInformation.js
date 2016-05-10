app.controller('getUserInformation', ['$scope', '$http', '__env', function($scope, $http, __env) {

  var userResult = {};

  $http({
    method: 'GET',
    url: __env.API_URL + '/users'
  }).then(function successCallback(response) {
    resultUser(response.data);
  }, function errorCallback(response) {
    console.log("error");
  });

  function resultUser(resultData) {
    var items = resultData.data;
    for (var k in items) {
      var user = items[k];

      var userData = {
        "id": user.id,
        "name": user.attributes.name,
        "photo": user.attributes.photo
      }

      var id = user.id;
      userResult[id] = userData;
    }
    console.log(userResult);
  }
}]);
