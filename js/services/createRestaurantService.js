/**
 * Service for creating restaurants
 */
app.factory('createRestaurantService', function(){
  var createRestaurantService = {};
  var form = {
    data: {}
  };

  // Stores formdata for when the controller is inactive
  createRestaurantService.setFormData = function(formData) {
    form.data = formData;
  };

  //Returns form with data
  createRestaurantService.getForm = function() {
    return form;
  };

  //Clears the form
  createRestaurantService.clearForm = function() {
    form.data = {};
  };

  //Sets clicked position on the form data
  createRestaurantService.setClickedPosition = function(marker) {
    form.data.marker = marker;
  }

  return createRestaurantService;
});
