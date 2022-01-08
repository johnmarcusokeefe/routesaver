
var markers;
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let labelIndex = 0;
  //
  // currently updates whole map
  //
  // map passed
  function showMap(map) {
    var dict = "";
    markers = []
    var geocoder = new google.maps.Geocoder();
    labelIndex = 0;
    const route_stops = document.querySelector('#active-route');
    //const items = route_stops.getElementsByTagName("latlngtag");
    // get addresses and geocode 

    const destinations = route_stops.getElementsByTagName('destination');
    console.log(destinations)
    // need to swap last to first for markers as the last is the origin 
    const destination_list = []
    for(var i = 0; i < destinations.length; i++) {
      destination_list[i] = destinations[i].dataset.end_address;
    }
    console.log("before", destination_list);
    last = destination_list.pop();
    destination_list.unshift(last);
    console.log("after", destination_list);
    // add first to last
    //
    for(var i = 0; i < destination_list.length; i++) {
      // add the number to the destination as it should be the same order
      console.log("destination list and index",destination_list[i],i);
      const label = destination_list[i].substring(0,destination_list[i].indexOf(','));
      
      //
      geocoder.geocode( { 'address': destination_list[i]}, function(results, status) {
        console.log(results);
        if (status == 'OK') {
          dict = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
          console.log(dict, label);
          addMarker(dict, map, label);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
      console.log(dict);
    };
    showMarkers(map);
  };
// Shows any markers currently in the array.
// Adds a marker to the map and push to the array.
function addMarker(position, map, destination, i) {
  console.log("addmarker", position, map, destination, i);
  const marker = new google.maps.Marker({
    position,
    title: destination,
    label: labels[labelIndex++],
    map,
  });
  markers.push(marker);
};
//
// Sets the map on all markers in the array
//
function setMapOnAll(map) {
  console.log(map);
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};
  //

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
  setMapOnAll(null);
};

// Shows any markers currently in the array.
function showMarkers(map) {
  setMapOnAll(map);
};