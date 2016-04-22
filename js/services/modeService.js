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