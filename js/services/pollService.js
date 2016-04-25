app.factory('pollService', function() {
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
      if (form.data.restaurants[i].attributes.id === restaurant.attributes.id) {
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
      if (form.data.restaurants[i].attributes.id === restaurant.attributes.id) {
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
    poll.data.voteLink = 'localhost:4444/polls/' + poll.data.id;
    pollMap[poll.data.id] = poll;
  }

  pollService.getActive = function() {
    return active;
  }

  pollService.getWithId = function(id) {
    return pollMap[id];
  }

  pollService.getAll = function() {
    return pollMap;
  }
  return pollService;
});
