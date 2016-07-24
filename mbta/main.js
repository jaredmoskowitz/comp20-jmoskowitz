var map;

markerIconPath = 'marker.png'

SouthStation    = {lat:    42.352271, lng: -71.05524200000001};
Andrew          = {lat:    42.330154, lng:         -71.057655};
PorterSquare    = {lat:      42.3884, lng: -71.11914899999999};
HarvardSquare   = {lat:    42.373362, lng:         -71.118956};
JFKUMass        = {lat:    42.320685, lng:         -71.052391};
SavinHill       = {lat:     42.31129, lng:         -71.053331};
ParkStreet      = {lat:  42.35639457, lng:        -71.0624242};
Broadway        = {lat:    42.342622, lng:         -71.056967};
NorthQuincy     = {lat:    42.275275, lng:         -71.029583};
Shawmut         = {lat:  42.29312583, lng: -71.06573796000001};
Davis           = {lat:     42.39674, lng:         -71.121815};
Alewife         = {lat:    42.395428, lng:         -71.142483};
KendallMIT      = {lat:  42.36249079, lng:       -71.08617653};
CharlesMGH      = {lat:    42.361166, lng:         -71.070628};
DowntownCrossing= {lat:    42.355518, lng:         -71.060225};
QuincyCenter    = {lat:    42.251809, lng:         -71.005409};
QuincyAdams     = {lat:    42.233391, lng:         -71.007153};
Ashmont         = {lat:    42.284652, lng: -71.06448899999999};
Wollaston       = {lat:   42.2665139, lng:        -71.0203369};
FieldsCorner    = {lat:    42.300093, lng:         -71.061667};
CentralSquare   = {lat:    42.365486, lng:         -71.103802};
Braintree       = {lat:   42.2078543, lng:        -71.0011385};

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
      center: SouthStation,
      zoom: 9
    });

    placeMarkers(map, redStops);
    drawRoute(map, redRoute);
  }

  /* places markers on map for given array of stops */
  function placeMarkers(map, stops) {
    for (var i = 0; i < stops.length; i++) {
      new google.maps.Marker({
        position: stops[i],
        map: map,
        title: stops[i].toString(),
        icon: markerIconPath
      });
    }
  }

  /* draws route on map for given (directional) adjacency list of stops */
  function drawRoute(map, route) {
    for (var i = 0; i < route.length; i++) {
      stop = route[i][0];
      var edge = [];
      edge.push(stop);

      /* loop to handle forks */
      for (var j = 0; j < route[i][1].length; j++) {
        edge.push(route[i][1][j])
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
