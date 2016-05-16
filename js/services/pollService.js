app.factory('pollService', ['$http', '__env', 'tokenService', '$location', function($http, __env, tokenService, $location) {
  var pollService = {};

  var pollMap = {};
  var active = {
    raw: {},
    cleaned: {},
  };
  var form = {
    data: {}
  };

  var socket = io.connect(__env.API_URL);

  pollService.setFormData = function(formData) {
    form.data = formData;
  };

  pollService.getForm = function() {
    return form;
  };

  pollService.addRestaurantToForm = function(restaurant) {
    if (!form.data.restaurants) {
      form.data.restaurants = [];
    }
    var restaurantFound = false;
    for (var i = 0; i < form.data.restaurants.length; i++) {
      if (form.data.restaurants[i].id === restaurant.id) {
        restaurantFound = true;
        break;
      }
    }
    if (!restaurantFound) {
      form.data.restaurants.push(restaurant);
      return true;
    }
    return false;
  };

  pollService.removeRestaurantFromForm = function(restaurant) {
    if (!form.data.restaurants) {
      return false;
    }
    var restaurantFound = false;
    for (var i = 0; i < form.data.restaurants.length; i++) {
      if (form.data.restaurants[i].id === restaurant.id) {
        restaurantFound = true;
        form.data.restaurants.splice(i, 1);
        break;
      }
    }
    if (!restaurantFound) {
      return false;
    }
    return true;
  };

  pollService.clearForm = function() {
    form.data = {};
  };

  pollService.setActiveId = function(id) {
    active.raw = pollMap[id].raw;
    active.cleaned = pollMap[id].cleaned;
    makeSocketListenOnPollId(id);
    $location.search('poll', id);
  }

  var makeSocketListenOnPollId = function(pollId) {
    console.log('SocketIO: listening on poll id: ' + pollId);
    socket.on(pollId, function(data) {
      pollService.add(data);
      if (pollId === active.raw.data.id) { // update the current active poll if it is showing on the screen
        pollService.setActiveId(pollId);
      }
    });
  }

  pollService.clearActivePoll = function() {
    active.raw = {};
    active.cleaned = {};
    $location.search('poll', null);
  }

  pollService.add = function(poll) {
    poll.data.voteLink = __env.CLIENT_URL + '?poll=' + poll.data.id;
    poll.data.expiresAsDateObj = new Date(poll.data.attributes.expires);
    poll.data.userHasSeenExpiredPopup = false;

    pollMap[poll.data.id] = {};
    pollMap[poll.data.id].raw = poll;
    pollMap[poll.data.id].cleaned = createCleanPollFromId(poll.data.id);

    setHasExpiredAndSetWinner(poll);
  }

  var setHasExpiredAndSetWinner = function(poll) {
    if (new Date() > poll.data.expiresAsDateObj)  {
      poll.data.hasExpired = true;
      setWinner(poll);
    } else {
      setTimeout(function() {
        poll.data.hasExpired = true;
        setWinner(poll);
      }, poll.data.expiresAsDateObj - new Date() - 20000);
    }
  };

  // Sets winner=true for the restaurants with the most votes
  var setWinner = function(poll) {
    var restaurantsInCleaned = pollMap[poll.data.id].cleaned.restaurants;
    var mostVotes = 0;

    // Find most number of votes for a restaurant
    for (var i = restaurantsInCleaned.length - 1; i >= 0; i--) {
      if (restaurantsInCleaned[i].votes.length > mostVotes) {
        mostVotes = restaurantsInCleaned[i].votes.length;
      }
    }

    // Set winner = true if a restaurant has the top number of votes (more than one winner can exist)
    for (var j = restaurantsInCleaned.length - 1; j >= 0; j--) {
      if (restaurantsInCleaned[j].votes.length === mostVotes) {
        restaurantsInCleaned[j].winner = true;
      }
    }
  }

  pollService.getActive = function() {
    return active;
  }

  pollService.getAll = function() {
    return pollMap;
  }

  pollService.joinActivePoll = function() {
    return $http({
        method: 'Post',
        url: __env.API_URL + '/polls/' + active.raw.data.id + '/users'
      }).then(function(response) {
        console.log('Joined poll ' + active.raw.data.id);
      })
      .catch(function(err)  {
        console.log('ERROR! Failed to send request to add user to poll');
        console.log(err);
      });
  }

  pollService.getPollIdAndSetAsActive = function(pollId) {
    return $http({
      method: 'Get',
      url: __env.API_URL + '/polls/' + pollId
    }).then(function(response) {
      console.log('Joined poll ' + pollId);
      pollService.add(response.data);
      pollService.setActiveId(pollId);

      return pollId;
    });
  }

  // Returns a "cleaned" poll, which is a poll-object that is more suitable to use
  // in the HTML. The function takes relevant data from "included" and puts it in their own top level key.
  // For example: each restaurant is located in the included-array, the function finds the restaurants and creates a
  // new restaurant-array which is easier for the HTML to go through.
  //
  // The function also adds some extra shortcut keys, "userIsParticipantInPoll" for example.
  var createCleanPollFromId = function(pollId)  {
    var currentUserId = tokenService.getUserId();

    var raw = pollMap[pollId].raw;

    var cleaned = {
      id: raw.data.id,
      voteLink: raw.data.voteLink,
      users: [],
      restaurants: [],
      votes: [],
      userIsParticipantInPoll: false
    };

    // Extract user data
    var rawUsers = raw.data.relationships.users.data;
    for (var i = 0; i < rawUsers.length; i++) {
      for (var j = 0; j < raw.included.length; j++) {
        if (raw.included[j].id === rawUsers[i].id) {
          cleaned.users.push(raw.included[j]);
        }

        if (currentUserId === raw.included[j].id) {
          cleaned.userIsParticipantInPoll = true;
        }
      }
    }

    // Extract restaurant data
    if (!raw.data.relationships.restaurants) { //Prevents error when poll is created without restaurants
      cleaned.restaurants = [];
    } else {
      var rawRestaurants = raw.data.relationships.restaurants.data;
      for (var i = 0; i < rawRestaurants.length; i++) {
        for (var j = 0; j < raw.included.length; j++) {
          if (raw.included[j].id === rawRestaurants[i].id) {
            var restaurant = raw.included[j];
            restaurant.votes = [];
            cleaned.restaurants.push(restaurant);
          }
        }
      }
    }

    // Extract vote data
    for (var i = 0; i < raw.included.length; i++) {
      if (raw.included[i].type === 'vote') {
        cleaned.votes.push({
          id: raw.included[i].id,
          user: raw.included[i].relationships.user.data.id,
          restaurant: raw.included[i].relationships.restaurant.data.id
        });

        var thisVoteBelongsToCurrentUser = false;
        if (currentUserId === raw.included[i].relationships.user.data.id) {
          thisVoteBelongsToCurrentUser = true;
        }

        // Add vote to vote array in restaurant
        for (var j = 0; j < cleaned.restaurants.length; j++) {
          if (cleaned.restaurants[j].id === raw.included[i].relationships.restaurant.data.id) {
            cleaned.restaurants[j].votes.push({
              id: raw.included[i].id,
              user: raw.included[i].relationships.user.data.id
            });

            // If user voted on this restaurant, mark it
            if (thisVoteBelongsToCurrentUser) {
              cleaned.restaurants[j].userVotedOnThisRestaurant = true;
            }
          }
        };
      }
    }

    return cleaned;
  }

  return pollService;
}]);
