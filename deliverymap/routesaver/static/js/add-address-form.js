document.querySelector("#add-address-form").style.display = "none";

// add address form
document.querySelector("#add-address-button").addEventListener("click", function () {
    if (document.querySelector("#add-address-form").style.display == "none") {
        document.querySelector("#add-address-form").style.display = "block";
    } else {
        document.querySelector("#add-address-form").style.display = "none";
    }
  }
);
