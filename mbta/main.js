var map;
var userLocation;

markerIconPath = 'marker.png'

SouthStation    = {name: "South Station", coords: {lat:    42.352271, lng: -71.05524200000001}};
Andrew          = {name: "Andrew", coords: {lat:    42.330154, lng:         -71.057655}};
PorterSquare    = {name: "Porter Square", coords: {lat:      42.3884, lng: -71.11914899999999}};
HarvardSquare   = {name: "Harvard Square", coords: {lat:    42.373362, lng:         -71.118956}};
JFKUMass        = {name: "JKF/UMass", coords: {lat:    42.320685, lng:         -71.052391}};
SavinHill       = {name: "Savin Hill", coords: {lat:     42.31129, lng:         -71.053331}};
ParkStreet      = {name: "Park Street", coords: {lat:  42.35639457, lng:        -71.0624242}};
Broadway        = {name: "Broadway", coords: {lat:    42.342622, lng:         -71.056967}};
NorthQuincy     = {name: "North Quincy", coords: {lat:    42.275275, lng:         -71.029583}};
Shawmut         = {name: "Shawmut", coords: {lat:  42.29312583, lng: -71.06573796000001}};
Davis           = {name: "Davis", coords: {lat:     42.39674, lng:         -71.121815}};
Alewife         = {name: "Alewife", coords: {lat:    42.395428, lng:         -71.142483}};
KendallMIT      = {name: "Kendall/MIT", coords: {lat:  42.36249079, lng:       -71.08617653}};
CharlesMGH      = {name: "Charles/MGH", coords: {lat:    42.361166, lng:         -71.070628}};
DowntownCrossing= {name: "Downtown Crossing", coords: {lat:    42.355518, lng:         -71.060225}};
QuincyCenter    = {name: "Quincy Center", coords: {lat:    42.251809, lng:         -71.005409}};
QuincyAdams     = {name: "Quincy Adams", coords: {lat:    42.233391, lng:         -71.007153}};
Ashmont         = {name: "Ashmont", coords: {lat:    42.284652, lng: -71.06448899999999}};
Wollaston       = {name: "Wollaston", coords: {lat:   42.2665139, lng:        -71.0203369}};
FieldsCorner    = {name: "Fields Corner", coords: {lat:    42.300093, lng:         -71.061667}};
CentralSquare   = {name: "Central Square", coords: {lat:    42.365486, lng:         -71.103802}};
Braintree       = {name: "Braintree", coords: {lat:   42.2078543, lng:        -71.0011385}};

var redStops = [SouthStation,
  Andrew,
  PorterSquare,
  HarvardSquare,
  JFKUMass,
  SavinHill,
  ParkStreet,
  Broadway,
  NorthQuincy,
  Shawmut,
  Davis,
  Alewife,
  KendallMIT,
  CharlesMGH,
  DowntownCrossing,
  QuincyCenter,
  QuincyAdams,
  Ashmont,
  Wollaston,
  FieldsCorner,
  CentralSquare,
  Braintree];

  var redRoute = [[Alewife, [Davis]],
  [Davis, [PorterSquare]],
  [PorterSquare, [HarvardSquare]],
  [HarvardSquare, [CentralSquare]],
  [CentralSquare, [KendallMIT]],
  [KendallMIT, [CharlesMGH]],
  [CharlesMGH, [ParkStreet]],
  [ParkStreet, [DowntownCrossing]],
  [DowntownCrossing, [SouthStation]],
  [SouthStation, [Broadway]],
  [Broadway, [Andrew]],
  [Andrew, [JFKUMass]],
  [JFKUMass, [NorthQuincy, SavinHill]],
  [NorthQuincy, [Wollaston]],
  [Wollaston, [QuincyCenter]],
  [QuincyCenter, [QuincyAdams]],
  [QuincyAdams, [Braintree]],
  [SavinHill, [FieldsCorner]],
  [FieldsCorner, [Shawmut]],
  [Shawmut, [Ashmont]]];

function init() {
  initMap();
}

/* initialize map to have markers and polylines */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: SouthStation.coords,
    zoom: 5
  });

  //set up MBTA
  placeMarkers(map, redStops, markerIconPath);
  drawRoute(map, redRoute);

  //user location specific things
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setupUserLocation);
  } else {
    console.log("Geolocation is not supported by this browser");
  }
}

/* places markers on map for given array of stops */
function placeMarkers(map, stops, iconPath) {
  for (var i = 0; i < stops.length; i++) {
    placeMarker(map, stops[i].coords, stops[i].name, iconPath);
  }
}

function placeMarker(map, coords, name, iconPath) {
  var marker =  new google.maps.Marker({
    position: coords,
    map: map,
    title: name,
    icon: iconPath
  });
  return marker;
}

/* draws route on map for given (directional) adjacency list of stops */
function drawRoute(map, route) {
  for (var i = 0; i < route.length; i++) {
    stop = route[i][0];
    var edge = [];
    edge.push(stop.coords);

    /* loop to handle forks */
    for (var j = 0; j < route[i][1].length; j++) {
      edge.push(route[i][1][j].coords)
      var path = new google.maps.Polyline({
        path: edge,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      path.setMap(map);
      edge.pop();
    }
  }
}

function setupUserLocation(position) {
  coords = {lat: position.coords.latitude, lng: position.coords.longitude};
  var marker = placeMarker(map, coords, "Current Location", null);
  setUserInfoWindow(marker, coords, map);
}

function setUserInfoWindow(userMarker, coords, map) {
  locDistances = getClosestLocationsFromPoint(coords, redStops);
  var contentString = '<div id="content">'+
    '<div>'+
    '<p>Stop closest to you: ' +
    locDistances[0].locationName +
    '</p>' +
    '<p>' +
    getInfoTableString(locDistances) +
    '</p>' +
    '</div>';

  var infowindow = new google.maps.InfoWindow({
      content: contentString
  });

  userMarker.addListener('click', function() {
    infowindow.open(map, userMarker);
  });
}


function getClosestLocationsFromPoint(point, locations) {
  var arr = [];
  for (var i = 0; i < locations.length; i++) {
    arr.push({
      locationName: locations[i].name,
      distance: distanceBetweenCoords(point, locations[i].coords)
    });
  }
  return arr.sort(function(a, b){return a.distance-b.distance});
}


function getInfoTableString(locDistances) {
  entriesString = '';
  for(var i = 0; i<locDistances.length; i++) {
    entriesString += '' +
    '<tr>' +
    '<td>' + locDistances[i].locationName + '</td>' +
    '<td>' + locDistances[i].distance + '</td>' +
    '</tr>';
  }
  htmlTable = '' +
  '<table id=\"table1\">' +
  '<tr>' +
    '<th>Name</th>' +
    '<th>Distance (mi)</th>' +
  '</tr>' +
  entriesString +
  '</table>';
  return htmlTable;
}

function distanceBetweenCoords(coord1, coord2) {

  var lat2 = coord2.lat;
  var lon2 = coord2.lng;
  var lat1 = coord1.lat;
  var lon1 = coord1.lng;

  // The below implementation for getting the distance between two geocoords
  // was found at the following URL:
  // http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
  Number.prototype.toRad = function() {
     return this * Math.PI / 180;
   }

  var R = 3956.55; // miles
  //has a problem with the .toRad() method below.
  var x1 = lat2-lat1;
  var dLat = x1.toRad();
  var x2 = lon2-lon1;
  var dLon = x2.toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d;
}
