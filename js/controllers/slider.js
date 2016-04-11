app.controller('slideMenu', function ($scope, $mdSidenav) {
    $scope.toggleMainMenu = buildToggler('main');
    $scope.toggleFilterMenu = buildToggler('filter');
    $scope.toggleMoreInfoMenu = buildToggler('info');
    $scope.toggleAddRestaurant = addRestaurantToggler();
    
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          if(navID == 'main'){
            $mdSidenav('filter').close();
            $mdSidenav('info').close();
          }else if(navID == 'filter'){
            $mdSidenav('main').close(); 
            $mdSidenav('info').close();
          }else{
            $mdSidenav('main').close();
            $mdSidenav('filter').close();
          }
      }
    }
    function addRestaurantToggler() {
        return function() {
            $mdSidenav('main').close(); 
        }
    }
    
  })
  