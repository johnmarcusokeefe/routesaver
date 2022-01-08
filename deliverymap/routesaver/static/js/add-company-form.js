// add company form
document.querySelector("#add-company-button").addEventListener("click", function () {
    if (document.querySelector("#add-company-form").style.display == "none") {
        document.querySelector("#add-company-form").style.display = "block";
    } else {
        document.querySelector("#add-company-form").style.display = "none";
    }
  }
);
