/**
 * Controller for adding polls (POST /polls)
 */
app.controller('addPoll', function($scope, $http) {

  //Input type "datetime-local" requires model to be a Date-object
  $scope.expires = {
    time: new Date(),
    isSet: false
  };

  //function is called when expiry is changed/set by user
  $scope.exiprySet = function (){
    $scope.expires.isSet = true;
  };

  /**
   * 1. Creates POST-body
   * 2. Sends post request to API
   * 3. Formatts response
   * 4. Returns response to ?????????????????????
   */
  $scope.regPoll = function (){
    var poll = createPollPostBody();

    $http({
        method: 'POST',
        url: 'http://128.199.48.244:3000/polls' ,
        headers: {'Content-Type': 'application/json'},
        data: poll
    }).then(function(response){
      var createdPoll = formatPoll(response.data);
    })
    .catch(function(err){
      console.log(err);
    });
  };

  /**
   * Formats response from API into a more usable object
   * @param  {Object} rawPollData response.data from API-call
   * @return {Object} Formatted poll-data
   */
  var formatPoll = function(rawPollData){
    //Transfer all attributes to a new object
    var formattedPoll = rawPollData.data.attributes;

    //Set id and create arrays for users and restaurants
    formattedPoll.id = rawPollData.data.id;
    formattedPoll.users = [];
    formattedPoll.restaurants = [];

    //Fill users and restaurants properties of formattedPoll with data from "included"
    for (let i = 0; i < rawPollData.included.length; i++) {
      var newObject = rawPollData.included[i].attributes;
      newObject.id = rawPollData.included[i].id;
      newObject.self = rawPollData.included[i].links.self;
      if(rawPollData.included[i].type = "user"){
        formattedPoll.users.push(newObject);
      } else if(rawPollData.included[i].type = "restaurant") {
        formattedPoll.restaurants.push(newObject);
      }
    }
    return formattedPoll;
  };

  /**
   * Creates a POST-body from the form for adding polls
   * @return {Object} Complete POST-body
   */
  var createPollPostBody = function(){
    var poll = {
        'name': $scope.name
    };

    //Only add parameters actually set by user
    if($scope.expires.isSet){
      poll.expires = $scope.expires.time;
    }
    if($scope.restaurants){
      poll.restaurants = $scope.restaurants;
    }
    if($scope.users){
      //Splits string at commas and trims away spaces
      poll.users = $scope.users.replace(/^\s*|\s*$/g,'').split(/\s*,\s*/);
    }
    if($scope.group){
      poll.group = $scope.group;
    }
    if($scope.allowNewRestaurants){
      poll.allowNewRestaurants = $scope.allowNewRestaurants;
    }
    return poll;
  };
});
