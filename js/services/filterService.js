app.factory('filterService', function(){
    var filterService = {};
    
    filterService.overlays = {
        1:{
          name: 'Sushi',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        2:{
          name: 'Snabbmat',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        3:{
          name: 'Hamburger',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        4:{
          name: 'Vegetarian',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        5:{
          name: 'Salad',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        6:{
          name: 'Pizza',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        7:{
          name: 'Indian',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        8:{
          name: 'Italian',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        9:{
          name: 'Thai',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        10:{
          name: 'Other',
          type: 'group',
          visible: true,
          layerParams:{
            showOnSelector: false
          }
        },
        11:{
          name: 'Café',
          type: 'group',
          visible: false,
          layerParams:{
            showOnSelector: false
          }
        }
      };
      
      filterService.toggleFilter = function(categoryId){
          filterService.overlays[categoryId].visible = !filterService.overlays[categoryId].visible;
      }
    
    return filterService;
});