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


//L.tileLayer(
//    'https://api.mapbox.com/styles/v1/mapbox/emerald-v8/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
//        tileSize: 512,
//        zoomOffset: -1,
//        attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//    }).addTo(map);

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

		new L.Control.GeoSearch({
				provider: new L.GeoSearch.Provider.Google()
		}).addTo(map);