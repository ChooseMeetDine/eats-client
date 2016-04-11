var map = L.map('map', { zoomControl: false }).locate({setView: true, maxZoom: 13});
var markers = new L.FeatureGroup();

new L.Control.Zoom({position: 'topright'}).addTo(map);

new L.control.locate({position: 'topright'}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy;
    L.marker(e.latlng, {icon:redIcon}).addTo(map);

    }   

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//costum marker with location
var greenIcon = L.icon({
    iconUrl: 'images/icons/marker-icon-coffee-red.png',
    iconSize:     [25, 41], // size of the icon
    iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
});

var redIcon = L.icon({
    iconUrl: 'images/icons/marker-icon-red.png',
    iconSize:     [25, 41], // size of the icon
    iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
});

L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    id: 'wiigolas.p7idlkkp',
    accessToken: 'pk.eyJ1Ijoid2lpZ29sYXMiLCJhIjoiY2lreHYxejNvMDA0NndsbTRmejl4NndqMSJ9.5hfLbJnXbAsfsPRT3V4W4Q'
}).addTo(map);

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
                marker = new L.marker([item.lat,item.lng]).bindPopup(info).addTo(map);
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

$('#map').on('click', '.trigger', function() {
    var restId = $(this).attr('id');
    //console.log(restId);
    angular.element(document.getElementById('moreInfoMenu')).scope().toggleMoreInfoMenu();
    angular.element($('#moreInfoSlider')).scope().createInfoScopes(restId);
});



