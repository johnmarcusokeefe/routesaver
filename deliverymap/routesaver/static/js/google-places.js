// This sample uses the Places Autocomplete widget to:
// 1. Help the user select a place
// 2. Retrieve the address components associated with that place
// 3. Populate the form fields with those address components.
// This sample requires the Places library, Maps JavaScript API.
// Include the libraries=places parameter when you first load the API.
// For example: <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let autocomplete;
//let address1Field;
//let address2Field;

let addressField;
let cityField;
let postcodeField;

function initAutocomplete() {
  //address1Field = document.querySelector("#ship-address");
  //address2Field = document.querySelector("#address2");
  
  addressField = document.querySelector("#id_address_line");
  cityField = document.querySelector("#id_city");
  postcodeField = document.querySelector("#id_postcode");
  // Create the autocomplete object, restricting the search predictions to
  // place id should give a reference to call a map
  autocomplete = new google.maps.places.Autocomplete(addressField, {
    componentRestrictions: { country: ["au"]  },
    fields: ["address_components", "geometry", "place_id", "url"],
    types: ["address"],
  });
  addressField.focus();
  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  let address = document.querySelector("#id_address1");
  let optional = document.querySelector("#id_address2");
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();
  let address0 = "";
  let address1 = "";
  let postcode = "";
   
  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  
  // this returns city as the loop has to find the type for each switch
 
  for (const component of place.address_components) {
    const componentType = component.types[0];
    // test print
    console.log("address components", place.address_components, place.place_id, place.url, place.geometry)
    //
    switch (componentType) {
     
      case "subpremise": {
        address0 = `${component.long_name} ${address0}`;
        break;
      }
      
      case "street_number": {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case "route": {
        address1 += component.short_name;
        break;
      }

      case "postal_code": {
        postcodeField.value = `${component.long_name}${postcode}`;
        //console.log("postcode", postcode);
        break;
      }

      case "locality":
         //console.log("locality", component.long_name);
         document.querySelector('#id_city').value = component.long_name;
         break;

      case "administrative_area_level_1": {
         document.querySelector("#id_state").value = component.short_name;
         break;
      }
       case "country":
         document.querySelector("#id_country_region").value = component.long_name;
         break;
    }
  }
  document.querySelector('#id_lat_lng').value = place.geometry.location.lat() +","+ place.geometry.location.lng();
  document.querySelector('#id_place_id').value = place.place_id;
  document.querySelector('#id_place_url').value = place.url;
  //console.log("lat long", place.geometry.location.lat(), place.geometry.location.lng())
  //console.log(address1);
  addressField.value = "";
  //
  if (address0.length > 0) {
    address.value = address0.trim()+"/"+address1;
  }
  else {
    address.value = address1;
  }
  

  //optional.value = address0;
  //address1Field.value = address1;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
  //address2Field.focus();
}