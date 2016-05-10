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

  createRestaurantService.setClickedPosition = function(marker) {
    /*form.data.lat = lat;
    form.data.lng = lng;*/
    form.data.marker = marker;
  }

  return createRestaurantService;
});
