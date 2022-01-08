// requires zoom 
let map;
var markers = [];
// calls the map the first time
function initRouteMap() {
    const myLatLng = { lat: -25.363, lng: 131.044 };
    map = new google.maps.Map(document.getElementById("route-map"), {
      zoom: 4,
      center: myLatLng,
    })
    const oc = document.querySelector('#select-company');
    oc.addEventListener('change', function() {
    setTimeout(function(){ showMap(); }, 800);
});
   
  // default call  
  setTimeout(function(){ showMap(); }, 800);
  //showMap();  
};
  //
  // currently updates whole map
  //
  function showMap() {
    deleteMarkers();
    const route_stops = document.querySelector('#route-companies');
    const items = route_stops.getElementsByTagName("li");
    
    for(var i = 0; i < items.length; i++) {
      var latlng = items[i].dataset.latlng.split(",");
      console.log("latlang", latlng);
      // format lat lng 
      var dict = {lat: parseFloat(latlng[0]), lng: parseFloat(latlng[1])};
      addMarker(dict);
    };
    showMarkers();
  };
  // Shows any markers currently in the array.
// Adds a marker to the map and push to the array.
function addMarker(position) {
  const marker = new google.maps.Marker({
    position,
    map,
  });
  markers.push(marker);
}
//
// Sets the map on all markers in the array
//
function setMapOnAll(map) {
  console.log(map);
  var bounds = new google.maps.LatLngBounds();
  
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    if (map != null) {
      bounds.extend(markers[i].getPosition());
    };
    console.log("markers length",markers.length);
  }
  //
  if (map != null) {
      map.fitBounds(bounds);
  };
 
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  hideMarkers();
  markers = [];
}