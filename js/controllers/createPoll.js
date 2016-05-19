/**
 * Controller for creating polls (POST /polls)
 */
// app.controller('addPoll', function($scope, $http) {
app.controller('createPoll', ['$scope', '$http', 'pollService', 'modeService', '__env', function($scope, $http, pollService, modeService, __env) {
  var date = new Date();
  var hour = date.getHours();
  $scope.hour = hour;
  var minute = 5 * Math.ceil( date.getMinutes() / 5 );
  $scope.minute = 5 * Math.ceil( date.getMinutes() / 5 );
  $scope.form = pollService.getForm();
  $scope.loading = false;
  $scope.error = '';    
  if(minute < 10 || hour < 10){
    $scope.form.data.hour = $scope.form.data.hour ? $scope.form.data.hour : '0' + String(hour); //initialize values if not set
    $scope.form.data.minute = $scope.form.data.minute ? $scope.form.data.minute : '0' + String(minute); //initialize values if not set
  }else{
      $scope.form.data.hour = $scope.form.data.hour ? $scope.form.data.hour : String(hour); //initialize values if not set
      $scope.form.data.minute = $scope.form.data.minute ? $scope.form.data.minute : String(minute); //initialize values if not set
  }


  /**
   * 1. Creates POST-body
   * 2. Sends post request to API
   * 3. Formats response
   * 4. Returns response to pollService
   */
  $scope.regPoll = function() {
    var postBody = createPollPostBody();
    if (!postBody.restaurants) {
      $scope.error = 'Du måste fylla i alla fält!';
      return;
    }

    $scope.error = null;
    $scope.loading = true;

    $http({
        method: 'POST',
        url: __env.API_URL + '/polls',
        headers: {
          'Content-Type': 'application/json'
        },
        data: postBody
      }).then(function(response) {
        $scope.clearForm();
        pollService.add(response.data); //Add poll to shared service
        pollService.setActiveId(response.data.data.id); //set poll as active

        $scope.swap('showActivePoll', true, true); //Hide this popup and show active poll
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
    $scope.form.data.hour = date.getHours();
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
      for (var i = 0; i < data.restaurants.length; i++) {
        poll.restaurants.push(data.restaurants[i].id);
      }
    }

    // NOTE: Bortkommenterad eftersom att detta inte längre behövs (länk finns nu)
    //Splits string at commas and trims away spaces
    // if (data.users) {
    //   poll.users = data.users.replace(/^\s*|\s*$/g, '').split(/\s*,\s*/);
    // }

    // NOTE: Bortkommenterad eftersom att det inte i dagsläget går att lägga till restauranger när omröstningen är skapad
    // if (data.allowNewRestaurants) {
    //   poll.allowNewRestaurants = data.allowNewRestaurants;
    // }
    return poll;
  };

}]);
