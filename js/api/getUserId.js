//TODO: TEST THIS API FUNCTION, MAYBE RESTRUCTURE RESULT DATA FOR APP.USAGE
// Not sure if this needs to be in a angular controller, if only called by other js-files
app.controller('getUserId', ['$scope', '$http', '__env', function($scope, $http, __env) {
  var userIdResult = getUserId(localStorage.getItem("userId"));
  $scope.userIdData = userIdResult;
  function getUserId(ID) {
    var id = ID;
    var link = __env.API_URL + '/users/' + new String(id);
    $http({
      method: 'GET',
      url: link
    }).then(function successCallback(response) {
      $scope.data = response;
      console.log(response.data);
    }, function errorCallback(response) {
      console.log("error");
    });
}}]);
