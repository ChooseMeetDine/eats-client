app.factory('pollService', function() {
    var pollService = {};

    var pollMap = {};
    var active = {};
    var form = {};

    pollService.setForm = function(formInput) {
        form = formInput;
    };

    pollService.getForm = function() {
        return form;
    };

    pollService.addRestaurantToForm = function(restaurant) {
        if (!form.restaurants) {
            form.restaurants = [];
        }
        var restaurantFound = false;
        for (var i = 0; i < form.restaurants.length; i++) {
            if (form.restaurants[i].id === restaurant.id) {
                restaurantFound = true;
                break;
            }
        }
        if (!restaurantFound) {
            alert('DU LA TILL RESTAURANGEN. WOHOO')
            form.restaurants.push(restaurant);
            return true;
        }
        return false;
    };

    pollService.removeRestaurantFromForm = function(restaurant) {
        if (!form.restaurants) {
            return false;
        }
        var restaurantFound = false;
        for (var i = 0; i < form.restaurants.length; i++) {
            if (form.restaurants[i].id === restaurant.id) {
                restaurantFound = true;
                array.splice(i, 1);
                break;
            }
        }
        if (!restaurantFound) {
            alert('DU TOG BORT RESTAURANGEN. WOHOO')
            return true;
        }
        return false;
    };

    pollService.setActiveId = function(id) {
        console.log('set a new active poll');
        active = pollMap[id];
    }

    pollService.add = function(poll) {
        console.log('added a new poll');
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