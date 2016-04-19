var map = L.map('map', { zoomControl: false, minZoom: 4}).locate({setView: true, maxZoom:15});

//Referenses to map styles that are saved online
//ID & Token list: 
//{beijar/cin5pab6g00sectnf9c96x1u2 : pk.eyJ1IjoiYmVpamFyIiwiYSI6ImNpbjVvbm14OTAwc3N2cW0yNW9qcTJiOHAifQ.fqEQVqMhNvFDasEpkwzz0Q
//{gustavsvensson/cin1hwd9a00bncznomsx507se : pk.eyJ1IjoiZ3VzdGF2c3ZlbnNzb24iLCJhIjoiY2lrOGh5cmc4MDJtb3cwa2djenZzbmwzbiJ9.aKbD4sJfKeFr1GBTtlvOFQ}

var mapId = 'gustavsvensson/cin628bnu00vwctnf2rdfbfmv'
var mapToken = 'pk.eyJ1IjoiZ3VzdGF2c3ZlbnNzb24iLCJhIjoiY2lrOGh5cmc4MDJtb3cwa2djenZzbmwzbiJ9.aKbD4sJfKeFr1GBTtlvOFQ'

L.tileLayer('https://api.mapbox.com/styles/v1/'+mapId+'/tiles/{z}/{x}/{y}?access_token='+mapToken, {
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

var markers = new L.FeatureGroup();

new L.Control.Zoom({position: 'topright'}).addTo(map);

new L.control.locate({position: 'topright'}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy;
    L.marker(e.latlng, {icon:yourLocationMarker}).addTo(map);
    }   

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//costum marker with location
var restMarker = L.icon({
    iconUrl: 'images/icons/rest_marker.png',
    iconSize:     [62, 62], // size of the icon
    iconAnchor:   [31, 62], // point of the icon which will correspond to marker's location
});

var cafeMarker = L.icon({
    iconUrl: 'images/icons/cafe_marker.png',
    iconSize:   [62, 62],
    iconAnchor: [31, 62],
});

var yourLocationMarker = L.icon({
    iconUrl: 'images/icons/you_marker.png',
    iconSize:     [24, 24], // size of the icon
    iconAnchor:   [12, 24], // point of the icon which will correspond to marker's location
});

//Function for creating map markers and marker popup from json data
function placeMarker(json) {
    //console.log(json);
    for (var key in json) { 
        var item = json[key];
        //calls function for rating stars element 
        var rating = createRatingStars(item.rating);
        //marker popup info
        var info = '<p>' + item.name + rating +'</p>' + '<img class="popupimg" src="' + item.photo + '"><br><button class="trigger" id="'+item.id +'">Mer info</button>';
        
        
        if(item.lng != null || item.lat != null) {
                var marker = markerType(item.extra.categories);
                marker = new L.marker([item.lat,item.lng],{icon: marker}).bindPopup(info).addTo(map);
                markers.addLayer(marker);
        }
        else {
            console.log("trasig latitude eller longitude data");
        }
    }  
};

//Create a star rating image from css based on restaurant 
//rating value from json data
function createRatingStars(rating) {
    var ratingValue = rating;
    var spanElement = '<span class="rating-static rating-'+ratingValue+'"></span>'
    return spanElement;
}

//function that loops thru the data of one restaurant object and checks if 
//it has the attribute of a café or not.
//returns a map marker corresponding the attribute found.
function markerType(restaurantExtraData){
    //console.log(restaurantExtraData);
    var data = restaurantExtraData;
    var rest = restMarker;
    for(i in data){
        var object = data[i];
        for(j in object){
            //TODO: Create a check if key exist n object
            if(object[j].id == "3"){
                rest = cafeMarker;
                break;
                }
            }
        }
    return rest;
};

$('#map').on('click', '.trigger', function() {
    var restId = $(this).attr('id');
    //console.log(restId);
    angular.element(document.getElementById('moreInfoMenu')).scope().toggleMoreInfoMenu();
    angular.element($('#moreInfoSlider')).scope().createInfoScopes(restId);
});


new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google()
}).addTo(map);