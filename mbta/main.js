var map;
var userLocation;
userToClosestStopLineColor = '#3F133D';
redLineColor = '#FF0000';
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
    zoom: 3
  });

  //set up MBTA
  markers = placeMarkers(map, redStops, markerIconPath);
  for (var i = 0; i < redStops.length; i++) {
    (function (name) {
      markers[i].addListener('click', function () {
        setStopInfoWindow(name, this, map);
      });
    })(redStops[i].name);
  }

  drawRoute(map, redRoute, redLineColor);

  //user location specific things
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setupUserLocation);
  } else {
    console.log("Geolocation is not supported by this browser");
  }
}

/* places markers on map for given array of stops */
function placeMarkers(map, stops, iconPath) {
  markers = [];
  for (var i = 0; i < stops.length; i++) {
    markers.push(placeMarker(map, stops[i].coords, stops[i].name, iconPath));
  }

  return markers;
}

/* places a marker on given map */
function placeMarker(map, coords, name, iconPath) {
  var marker =  new google.maps.Marker({
    position: coords,
    map: map,
    title: name,
    icon: iconPath
  });
  return marker;
}

function addClickHandlerToMarker(marker, map, callback) {

}

/* draws route on map for given (directional) adjacency list of stops */
function drawRoute(map, route, color) {
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
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      path.setMap(map);
      edge.pop();
    }
  }
}

/* sets marker, info window, and polyine to closest stop */
function setupUserLocation(position) {
  userLoc = {name: "current location", coords: {lat: position.coords.latitude, lng: position.coords.longitude}};
  locDistances = getClosestLocationsFromPoint(userLoc.coords, redStops);

  var marker = placeMarker(map, userLoc.coords, userLoc.name, null);
  setUserInfoWindow(marker, userLoc.coords, locDistances, map);

  //draw line to closest station
  drawRoute(map, [[userLoc, [locDistances[0].location]]], userToClosestStopLineColor);
}

/* Sets the html for when the user marker is clicked */
function setUserInfoWindow(userMarker, coords, locDistances, map) {
  var contentString = '<div id="content">'+
    '<div>'+
    '<p>Stop closest to you: ' +
    locDistances[0].location.name +
    '</p>' +
    '<p>' +
    getUserInfoTableString(locDistances) +
    '</p>' +
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    userMarker.addListener('click', function() {
      infowindow.open(map, userMarker);
    });
}

/* returns a string representing the html for the info window on the user marker*/
function getUserInfoTableString(locDistances) {
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

/* Sets the html for when a stop is clicked */
function displayStopInfoWindow(predictions, marker, map) {
  var titleString;
  if (predictions.length <= 0) {
    titleString = "Sorry, no trains are coming!";
  } else {
    titleString = predictions[0].stop;
  }
  var contentString = '<div id="content">'+
    '<div>'+
    '<p>' +
    titleString +
    '</p>' +
    '<p>' +
    getStopInfoTableString(predictions) +
    '</p>' +
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    infowindow.open(map, marker);
}

function getStopInfoTableString(predictions) {
  entriesString = '';
  for(var i = 0; i < predictions.length; i++) {
    entriesString += '' +
    '<tr>' +
    '<td>' + predictions[i].destination + '</td>' +
    '<td>' + predictions[i].seconds + '</td>' +
    '</tr>';
  }
  htmlTable = '' +
  '<table id=\"table2\">' +
  '<tr>' +
    '<th>Destination</th>' +
    '<th>Seconds</th>' +
  '</tr>' +
  entriesString +
  '</table>';
  return htmlTable;
}

/*
returns an array in ascending order of distance from given point
where each element has format: {locationName: __, distance:__ }
*/
function getClosestLocationsFromPoint(point, locations) {
  var arr = [];
  for (var i = 0; i < locations.length; i++) {
    arr.push({
      location: locations[i],
      distance: distanceBetweenCoords(point, locations[i].coords)
    });
  }

  return arr.sort(function(a, b){return a.distance-b.distance});
}

/* calculates the distance between two coordinates */
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


function setStopInfoWindow(stopName, marker, map) {
  var request = new XMLHttpRequest();
  request.open("GET", "https://whispering-wildwood-58478.herokuapp.com/redline.json", true);

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      jsondata = request.responseText;
      console.log(jsondata);
      predictions = parseTrips(jsondata, stopName);
      displayStopInfoWindow(predictions, marker, map);
    }
    else if (request.readyState == 4 && request.status != 200) {
      console.log("Something went wrong with the request!");
    }
    else
    {
      console.log("In progress...");
    }
  };

  request.send(null);
}

function parseTrips(jsondata, stopName) {
  data = JSON.parse(jsondata);
  trips = data.TripList.Trips;

  stopSchedule = [];
  for (var i = 0; i < trips.length; i++) {
    trip = trips[i];
    dest = trip.Destination;
    console.log("stop: " + stopName);
    for (var j = 0; j < trip.Predictions.length; j++) {

      if (trip.Predictions[j].Stop == stopName) {
        stopSchedule.push({
          stop: stopName,
          destination: dest,
          seconds: trip.Predictions[j].Seconds
        });
      }
    }
  }
  return stopSchedule;
}
