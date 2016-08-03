// function initMap() {
//   var myLatLng = {lat: 56.067, lng: -8.566495};
//   var myLatLng1 = {lat: 54.067, lng: -7.566495};
// 	var myLatLng2 = {lat: 53.067, lng: -6.566495};
//   var map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 4,
//     center: myLatLng
//   });

//   var marker = new google.maps.Marker({
//     position: myLatLng,
//     map: map,
//     title: 'Hello World!'
//   });
//     var marker1 = new google.maps.Marker({
//     position: myLatLng1,
//     map: map,
//     title: 'Hello World!'
//   });
//         var marker2 = new google.maps.Marker({
//     position: myLatLng2,
//     map: map,
//     title: 'Hello World!'
//   });
// 

// function initMap() {
// 	var image = 'egg-icon.png';
//     var map;
//     var bounds = new google.maps.LatLngBounds();
//     var mapOptions = {
//         mapTypeId: 'roadmap',
//         icon: image
//     };
                    
//     // Display a map on the page
//     map = new google.maps.Map(document.getElementById("map"), mapOptions);
//     map.setTilt(45);
        
//     // Multiple Markers
//     var markers = [
//         ['London Eye, London', 51.503454,-0.119562],
//         ['Palace of Westminster, London', 51.499633,-0.124755]
//     ];
                        
//     // Info Window Content
//     var infoWindowContent = [
//         ['<div class="info_content">' +
//         '<h3>London Eye</h3>' +
//         '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
//         ['<div class="info_content">' +
//         '<h3>Palace of Westminster</h3>' +
//         '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
//         '</div>']
//     ];
        
//     // Display multiple markers on a map
//     var infoWindow = new google.maps.InfoWindow(), marker, i;
    
//     // Loop through our array of markers & place each one on the map  
//     for( i = 0; i < markers.length; i++ ) {
//         var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
//         bounds.extend(position);
//         marker = new google.maps.Marker({
//             position: position,
//             map: map,
//             title: markers[i][0]
//         });
        
//         // Allow each marker to have an info window    
//         google.maps.event.addListener(marker, 'click', (function(marker, i) {
//             return function() {
//                 infoWindow.setContent(infoWindowContent[i][0]);
//                 infoWindow.open(map, marker);
//             }
//         })(marker, i));

//         // Automatically center the map fitting all markers on the screen
//         map.fitBounds(bounds);
//     }

//     // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
//     var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
//         this.setZoom(14);
//         google.maps.event.removeListener(boundsListener);
//     });
    
// }


// The following example creates complex markers to indicate beaches near
// Sydney, NSW, Australia. Note that the anchor is set to (0,32) to correspond
// to the base of the flagpole.

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 47.0830579, lng: 7.3791706}
  });

  setMarkers(map);
}

// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
var beaches = [
  ['Bondi Beach', 50.540419, 9.915081, 4],
  ['Coogee Beach', 45.540090, 2.911138, 5],
  ['Cronulla Beach', 42.010309, -4.575835, 3],
  ['Manly Beach',52.859879, -2.402198, 2],
  ['Maroubra Beach', 45.413077, 10.277354, 1]
];
var beaches2 = [
  ['Bondi Beach', 42.540419, -7.915081, 4],
  ['Coogee Beach', 42.540090, 5.911138, 5],
];


function setMarkers(map) {
  // Adds markers to the map.

  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.

  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  var image = {url: 'img/egg-icon.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(30, 40),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)}
  var image2 = 
    { url: 'img/egg-icon-blue.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(30, 40),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
  };
  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };
  for (var i = 0; i < beaches.length; i++) {
    var beach = beaches[i];
    var marker = new google.maps.Marker({
      position: {lat: beach[1], lng: beach[2]},
      map: map,
      icon: image,
      shape: shape[i],
      title: beach[0],
      zIndex: beach[3]
    });
  }

    for (var i = 0; i < beaches2.length; i++) {
    var beach = beaches2[i];
    var marker = new google.maps.Marker({
      position: {lat: beach[1], lng: beach[2]},
      map: map,
      icon: image2,
      shape: shape[i],
      title: beach[0],
      zIndex: beach[3]
    });
  }
}