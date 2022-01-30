document.querySelector("#location-details-form").style.display = "none";

document.querySelector("#location-details-form-button").addEventListener("click", function () {
    // set as read only
    if (document.querySelector("#location-details-form").style.display == "none") {
        document.querySelector("#location-details-form").style.display = "block";
        // fill values
        document.querySelector("#id_address_contact_name").value = document.querySelector("#person").innerHTML;
        document.querySelector("#id_address_phone").value = document.querySelector("#phone").innerHTML;
        document.querySelector("#id_address_description").value = document.querySelector("#description").innerHTML;
        //
        document.querySelector("#location-details").style.display = "none";
    } else {
        document.querySelector("#location-details-form").style.display = "none";
        document.querySelector("#location-details").style.display = "block";
    }
  }
);
// upload image form display toggle
document.querySelector('#location-upload-image').style.display = "none";

document.querySelector("#location-upload-image-button").addEventListener("click", function () {

if (document.querySelector("#location-upload-image").style.display == "none") {
    document.querySelector("#location-upload-image").style.display = "block";
} else {
    document.querySelector("#location-upload-image").style.display = "none";
}
});