/**
 * Controller for adding polls (POST /polls)
 */
// app.controller('addPoll', function($scope, $http) {
app.controller('addPoll', ['$scope', '$http', 'pollService', 'modeService', function($scope, $http, pollService, modeService) {


  $scope.form = pollService.getForm();
  $scope.loading = false;
  $scope.error = '';

  /**
   * 1. Creates POST-body
   * 2. Sends post request to API
   * 3. Formats response
   * 4. Returns response to pollService
   */
  $scope.regPoll = function() {
    var postBody = createPollPostBody();
    $scope.error = null;
    $scope.loading = true;

    $http({
        method: 'POST',
        url: 'http://128.199.48.244:3000/polls',
        headers: {
          'Content-Type': 'application/json'
        },
        data: postBody
      }).then(function(response) {
        
        response.data.data.relationships.restaurants = {
            data: [{"type":"restaurant","id":"10", "attributes": {
        "name": "Din Restaurang",
        "lat": 56.1234,
        "lng": 14.1234,
        "temporary": false
      }}, {"type":"restaurant","id":"10", "attributes": {
        "name": "Min fina Restaurang",
        "lat": 56.1234,
        "lng": 14.1234,
        "temporary": false
      }}]
        }
        pollService.add(response.data); //Add poll to shared service
        pollService.setActiveId(response.data.data.id); //set poll as active
        $scope.swap('showActivePoll'); //Hide this popup and show active poll
        $scope.loading = false;
      })
      .catch(function(err) {
        $scope.error = err.data.error;
        $scope.loading = false;
      });
  };

  $scope.addRestaurants = function() {
    modeService.setMode('ADD_RESTAURANTS_MODE');
    $scope.hide();
  };
  // An example of how this can be formatted if JSON-API is hard to work with. 
  // /**
  //  * Formats response from API into a more usable object
  //  * @param  {Object} rawPollData response.data from API-call
  //  * @return {Object} Formatted poll-data
  //  */
  // var formatPoll = function(rawPollData) {
  //   //Transfer all attributes to a new object
  //   var formattedPoll = rawPollData.data.attributes;

  //   //Set id and create arrays for users and restaurants
  //   formattedPoll.id = rawPollData.data.id;
  //   formattedPoll.users = [];
  //   formattedPoll.restaurants = [];

  //   //Fill users and restaurants properties of formattedPoll with data from "included"
  //   for (let i = 0; i < rawPollData.included.length; i++) {
  //     var newObject = rawPollData.included[i].attributes;
  //     newObject.id = rawPollData.included[i].id;
  //     newObject.self = rawPollData.included[i].links.self;
  //     if (rawPollData.included[i].type = "user") {
  //       formattedPoll.users.push(newObject);
  //     } else if (rawPollData.included[i].type = "restaurant") {
  //       formattedPoll.restaurants.push(newObject);
  //     }
  //   }
  //   return formattedPoll;
  // };

  /**
   * Creates a POST-body from the form for adding polls
   * @return {Object} Complete POST-body
   */
  var createPollPostBody = function() {
    var data = $scope.form.data;

    var poll = {
      'name': data.name
    };

    if (data.users) {
      //Splits string at commas and trims away spaces
      poll.users = data.users.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/);
    }
    if (data.allowNewRestaurants) {
      poll.allowNewRestaurants = data.allowNewRestaurants;
    }
    return poll;
  };


}]);