/**
 * Controller for adding polls (POST /polls)
 */
// app.controller('addPoll', function($scope, $http) {
app.controller('addPoll', ['$scope', '$http', 'pollService', 'modeService', function($scope, $http, pollService, modeService) {
  $scope.form = pollService.getForm();
  $scope.loading = false;
  $scope.error = '';
  $scope.form.data.hour = $scope.form.data.hour ? $scope.form.data.hour:'12'; //initialize values if not set
  $scope.form.data.minute = $scope.form.data.minute ? $scope.form.data.minute:'00'; //initialize values if not set

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
        url: 'http://128.199.48.244:7000/polls',
        headers: {
          'Content-Type': 'application/json'
        },
        data: postBody
      }).then(function(response) {
        $scope.clearForm();
        response.data.data.attributes.exipres = new Date (response.data.data.attributes.exipres);
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

  $scope.removeRestaurant = function($chip) {
    pollService.removeRestaurantFromForm($chip);
  };

  $scope.clearForm = function() {
    pollService.clearForm();
    $scope.form.data.hour = '12';
    $scope.form.data.minute = '00';
  };

  /**
   * Creates a POST-body from the form for adding polls
   * @return {Object} Complete POST-body
   */
  var createPollPostBody = function() {
    var data = $scope.form.data;

    var poll = {
      'name': data.name
    };

    var expires = new Date();
    expires.setHours(data.hour);
    expires.setMinutes(data.minute);
    poll.expires = expires;

    if (data.restaurants) {
      poll.restaurants = [];
      for (let i = 0; i < data.restaurants.length; i++) {
        poll.restaurants.push(data.restaurants[i].attributes.id);
      }
    }

    //Splits string at commas and trims away spaces
    if (data.users) {
      poll.users = data.users.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/);
    }

    if (data.allowNewRestaurants) {
      poll.allowNewRestaurants = data.allowNewRestaurants;
    }
    return poll;
  };

}]);
