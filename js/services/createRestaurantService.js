app.factory('createRestaurantService', function(){
  var createRestaurantService = {};
  var form = {
    data: {}
  };

  createRestaurantService.setFormData = function(formData) {
    form.data = formData;
  };

  createRestaurantService.getForm = function() {
    return form;
  };

  createRestaurantService.clearForm = function() {
    form.data = {};
  };

  createRestaurantService.setClickedPosition = function(lat, lng) {
    form.data.lat = lat;
    form.data.lng = lng;
  }

  return createRestaurantService;
});
