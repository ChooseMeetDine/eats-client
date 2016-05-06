app.factory('pollService', ['$http', '__env', function($http, __env) {
  var pollService = {};

  var pollMap = {};
  var active = {};
  var form = {
    data: {}
  };

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
    active = pollMap[id];
  }

  pollService.add = function(poll) {
    poll.data.voteLink = __env.CLIENT_URL + '?poll=' + poll.data.id;
    poll.data.expiresAsDateObj = new Date(poll.data.attributes.expires);
    pollMap[poll.data.id] = poll;
  }

  pollService.getActive = function() {
    return active;
  }


  pollService.getActiveWithCleanedData = function()  {
    var cleanedActive = {
      id: active.data.id,
      voteLink: active.data.voteLink,
      users: [],
      restaurants: [],
      votes: []
    };

    // Extract user data
    var activeUsers = active.data.relationships.users.data;
    for (var i = 0; i < activeUsers.length; i++) {
      for (var j = 0; j < active.included.length; j++) {
        if (active.included[j].id === activeUsers[i].id) {
          cleanedActive.users.push(active.included[j]);
        }
      }
    }

    // Extract restaurant data
    if (!active.data.relationships.restaurants) { //Prevents error when poll is created without restaurants
      cleanedActive.restaurants = [];
    } else {
      var activeRestaurants = active.data.relationships.restaurants.data;
      for (var i = 0; i < activeRestaurants.length; i++) {
        for (var j = 0; j < active.included.length; j++) {
          if (active.included[j].id === activeRestaurants[i].id) {
            var restaurant = active.included[j];
            restaurant.votes = [];
            cleanedActive.restaurants.push(restaurant);
          }
        }
      }
    }

    // Extract vote data
    for (var i = 0; i < active.included.length; i++) {
      if (active.included[i].type === 'vote') {
        cleanedActive.votes.push({
          id: active.included[i].id,
          user: active.included[i].relationships.user.data.id,
          restaurant: active.included[i].relationships.restaurant.data.id
        });

        // Add vote to vote array in restaurant
        for (var j = 0; j < cleanedActive.restaurants.length; j++) {
          if (cleanedActive.restaurants[j].id === active.included[i].relationships.restaurant.data.id) {
            cleanedActive.restaurants[j].votes.push({
              id: active.included[i].id,
              user: active.included[i].relationships.user.data.id
            })
          }
        };
      }
    }

    return cleanedActive;
  }

  pollService.getWithId = function(id) {
    return pollMap[id];
  }

  pollService.getAll = function() {
    return pollMap;
  }

  pollService.checkIfUserIsParticipantInActivePoll = function(userId) {
    var allUsers = active.data.relationships.users.data;
    for (var i = 0; i < allUsers.length; i++) {
      if (userId === allUsers[i].id) {
        return true;
      }
    }
    return false;
  }

  pollService.checkWhatRestaurantUserHasVotedOnInActivePoll = function(userId) {
    console.log(active);
    var included = active.included;
    for (var i = 0; i < included.length; i++) {
      if (included[i].type === 'vote' && included[i].relationships.user.data.id === userId) {
        return included[i].relationships.restaurant.data.id;
      }
    }
    return null;
  }

  pollService.joinActivePoll = function() {
    return $http({
        method: 'Post',
        url: __env.API_URL + '/polls/' + active.data.id + '/users'
      }).then(function(response) {
        console.log('Joined poll');
      })
      .catch(function(err)  {
        console.log(err);
        alert(err);
      });
  }

  pollService.getPollIdAndSetAsActive = function(pollId) {
    return $http({
      method: 'Get',
      url: __env.API_URL + '/polls/' + pollId
    }).then(function(response) {
      console.log('Joined poll');
      pollService.add(response.data);
      active = pollMap[pollId];
      return pollId;
    });
  }

  return pollService;
}]);
