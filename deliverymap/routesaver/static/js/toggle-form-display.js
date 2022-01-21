//
// pass button and selector to toggle display
//

function toggle_display(selector){
    console.log("click toggle display")
    // route container
        if (document.querySelector(selector).style.display == "none") {
            document.querySelector(selector).style.display = "block";
        } else {
            document.querySelector(selector).style.display = "none";
        }
    };