/**
 * Serivce that handles the current mode, i.e. if the user is adding restarurants
 * to a poll or choosing the location of a new restarurant. Changing the mode changes
 * the behaviour of the site.
 */
app.factory('modeService', function() {
    var mode = {
        active: 'DEFAULT'
    };
    var service = {};

    service.setMode = function(inputMode) {
        mode.active = inputMode;
    }

    service.getMode = function() {
        return mode;
    }
    return service;
});
