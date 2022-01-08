document.querySelector("#route-input-container").style.display = "none";

// route container
document.querySelector("#add-route").addEventListener("click", function () {
    if (document.querySelector("#route-input-container").style.display == "none") {
        document.querySelector("#route-input-container").style.display = "block";
    } else {
        document.querySelector("#route-input-container").style.display = "none";
    }
  }
);
