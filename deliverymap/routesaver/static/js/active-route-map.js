// preview button disabled until route is selected
try {
  preview_button = document.querySelector("#preview-button");
  preview_button.disabled = true;
  document.querySelector("#select-route").addEventListener("change", function () { 
      preview_button.disabled = false;
   })
}
catch {
  console.log('dom element not loaded for this url: ', window.location.href);
};
// suppress markers
// goal is to add markers on top 
// https://stackoverflow.com/questions/50926867/google-maps-hide-destination-marker
// [START maps_directions_waypoints]
function initMap() {
    //
    var rendererOptions = {
      suppressMarkers: true,
    };
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: -34.397, lng: 150.644 },
    });
  
    directionsRenderer.setMap(map);
    // call route app
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
   span.onclick = function() {
       modal.style.display = "none";
    }
    document.getElementById("preview-button").addEventListener('click', () => {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
        setTimeout(function(){ showMap(map); }, 1000);
    })
};
  //
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    var modal = document.getElementById("modal");
    modal.style.display = "block";
    var waypts = [];
    //
    // gets the place ids from rendered list
    //
    const addresses = document.querySelectorAll('[data-end_address]');
    // start = document.querySelector("#select-start").value;
    // returns the address database id, needs to be the
    var origin;
    addresses.forEach(function(data){
        console.log("data", data);
        if(origin != data.getAttribute('data-end_address')) {
          marker = data.getAttribute('data-end_address');
        }
        waypts.push({
          // location needs to be in place id format
          location: marker,
          stopover: true,
        });
        console.log(waypts.length)
        // last value stored will be the last passed will be the end of the loop
        origin = data.getAttribute('data-end_address');
      });
    // remove the origin from the first list value
    // remove origin but seems not to effect the markers

    directionsService
      .route({
        origin: origin,
        // contains the last in the iteration
        destination: origin,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        console.log("response",response['geocoded_waypoints']);
        response['geocoded_waypoints'].pop()
        response['geocoded_waypoints'].shift()
        
        directionsRenderer.setDirections(response);
        // For each route, display summary information.
        
      })
      .catch((e) => window.alert("Directions request failed due to " + e));
  };
  // [END maps_directions_waypoints]