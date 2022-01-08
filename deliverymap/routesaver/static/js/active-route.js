//
// init 
//
document.addEventListener('DOMContentLoaded', function () {
  const date_now = new Date();
  //console.log(date_now)
  // date and time is not accurate
  try {
    departure = document.getElementById("departure-time");
    departure.defaultValue = date_now.toISOString().substring(0, 19);
  }
  catch {
    console.log('dom element not loaded for this url: ', window.location.href);
  }
  try {
    document.querySelector('#stats').style.display = "none";
  }
  catch {
    console.log("route.js not loaded");
  }
});
//
//
//
async function route_load(route_id) {
    
  await fetch('load_route/'+route_id+'/') 
      .then(response => response.json())
      .then(data => {
          /* process your data further */
          console.log("success", data);
          document.querySelector('#display_route').innerHTML = data[0]["route_name"];
      })
      .catch(error => console.error(error));

};
//
// gets the route data and creates a list to display either all 'index' or for the 'route'
//
function load_route_addresses(page, route_id) {
  // banner labe value
  document.querySelector('#route-display').innerHTML = route_id;
  
  // reset input selection
  document.querySelector('#select-start').value = 0;
  document.querySelector('#select-route').value = 0;
  const tolls = document.querySelector('#tolls').checked;
  var departure_time = document.querySelector('#date-picker').value;
  console.log("active route 49", departure_time); 
  // display start time
  var start_time = document.querySelector('#start-time');
  var traffic_model = document.querySelector('input[name="travel-model"]:checked').value;

  dt = departure_time.split('T');
  d = dt[0].split('-');
  t = dt[1].split(':');

  // milliseconds
  const utc_departure_time = Date.UTC(d[0],d[1],d[2],t[0],t[1],0);

  console.log("departure time", dt, new Date(departure_time).toString());
  
  start_array = new Date(departure_time).toString().split(" ");
  let day_name = start_array[0];
  let month = start_array[1];
  let day_number = start_array[2];
  let year = start_array[3];
  let time = start_array[4];

  const id_data = {'route_id': route_id, 'origin_id': window.origin_id, 
      'departure_time': utc_departure_time, 'tolls':tolls, 'traffic_model':traffic_model};

  // display start time
  //start_time.innerHTML = dt[1]+' - '+dt[0];
  start_time.innerHTML = "<br>time: " + time + "<br>date: "+ day_name + ", " + day_number + " " + month + " " + year;
  // get data
  fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id_data),
  })
    .then(response => response.json())
    .then(data => {
      console.log('load addresses', data);
      
      // build the address list
      if(page=="index"){
        document.querySelector('#active-route').innerHTML = "";
        //console.log("data",data);
       // data contains the address list to display
       if(data['destination_data'].length > 2) {
          document.querySelector('#stats').style.display = "block";
          document.querySelector('#preview-button').disabled = false;
          load_active(data);
          
       } else {
          document.querySelector('#stats').style.display = "none";
          const active_route = document.querySelector('#active-route');
          var banner = document.createElement('div');
          banner.className = "text-center p-5";
          banner.innerHTML = "Not enough destinations to display route!";
          active_route.append(banner);
       };
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
// address line
//
var dist = 0;
var dur = 0;
var previous_duration = 0;
//
// creates the address list in order on index.html
//
function load_active(data) {
  // get the data values 
  console.log("data 109",data)
  var stopover_value = 0;
  // 
  
  // starts from 2nd address and origin set on banner
  var finish_time = document.querySelector('#finish-time');
  var start_time = document.querySelector('#start-time');
  start_value = start_time.innerHTML;
  // departure time from date picker
  var departure_time = Date.parse(document.querySelector('#date-picker').value);
  //
  for(var i = 0; i < data['destination_data'].length; i++) {
    if (i == 0) {
      display_origin(data['destination_data'][i]['name'], data['destination_data'][i]['address__address1'])
    }
    else { 
    // stats
    var total_travel_time = document.querySelector('#total-travel-time');
    var total_distance = document.querySelector('#total-distance');
    previous_duration = dur;
    // data is seconds and multiplied by 1000 to create milliseconds. dur is seconds
    dur = dur + data['duration'][i-1]['value']*1000;
    dist = dist + data['distance'][i-1];
    display_duration = dur/3600/1000;
    total_travel_time.innerHTML = display_duration.toFixed(2) + " hrs";
    // duration is in seconds and date uses milliseconds
    //
    // finish time 
    // 
    finish_time_value = dur + departure_time;
    finish_array = new Date(finish_time_value).toString().split(" ");
    let day_name = finish_array[0];
    let month = finish_array[1];
    let day_number = finish_array[2];
    let year = finish_array[3];
    let time = finish_array[4];
    
    finish_time.innerHTML = "<br>time: " + time + "<br>date: "+ day_name + ", " + day_number + " " + month + " " + year;

    total_distance.innerHTML = (dist/1000).toFixed(2) + " kms";
    // arrows in between destinations
    const transition_container  = document.createElement('div');
    transition_container.className = "text-center p-3";
    const down_arrow = document.createElement('span');
    down_arrow.className = "material-icons";
    down_arrow.innerHTML = "arrow_downward";
    transition_container.append(down_arrow);
  //
  // address line
  //
    const active_address_line = document.createElement('div');
    active_address_line.className = "container border bg-light";
    // sequence number
    // const seq_num = document.createElement('div');
    // seq_num.className = "col-3";
    // seq_num.innerHTML = i;
    //
    // company name/link
    //
    const company = document.createElement('a');
    company.className = "col-4";
  
    // company line if exists
    if (data['destination_data'][i]['name'] == "none") {
      company.innerHTML = "none";
    } else {
      company.innerHTML = i +": " + data['destination_data'][i]['name'];
      company.href = "/company_details/"+data['destination_data'][i]['id']+"/";
      company.target = "blank";
    }
    //
    // address reference. 
    //
    const address_ref = document.createElement('destination');
    address_ref.hidden = true;
    address_ref.dataset.end_address = data['destination_data'][i]['address__lat_lng'];
    //
    // address
    //
    const address_link = document.createElement('a');
    address_link.className = "col-8";
    address_link.innerHTML = data['destination_data'][i]['address__address1'];
    address_link.href = data['destination_data'][i]['address__place_url'];
    address_link.target = "blank";

    // arrival time
    const arrival_time = document.createElement('div');
    arrival_time.className = "col-4";
    
    // departure time is milliseconds
    var added_time = dur + departure_time + stopover_value;
    let full_date = new Date(added_time);
    let date_array = full_date.toString().split(" ");
    console.log(date_array);
    day_name = date_array[0];
    month = date_array[1];
    day_number = date_array[2];
    year = date_array[3];
    time = date_array[4];
   
    arrival_time.innerHTML = "Arrival:<br>time: " + time + "<br>date: "+ day_name + ", " + day_number + " " + month + " " + year;
    //
    // travel distance - bottom row
    //
    const odometer = document.createElement('span');
    odometer.className = "material-icons float-left pr-1";
    odometer.innerHTML = "drive_eta";
    const distance = document.createElement('div');
    distance.id = "distance";
    distance.className = "col-3 float-left pl-2";
    distance.innerText = (data['distance'][i-1]/1000).toFixed(1)+" kms";
    distance.append(odometer);
    //
    // travel time
    //
    const clock = document.createElement('span');
    clock.className = "material-icons float-left pr-2";
    clock.innerHTML = "schedule";
    const travel_time = document.createElement('div');
    travel_time.id = "travel_time";
    travel_time.className = "col-3 float-left";
    travel_time.innerText = data['duration'][i-1]['text'];
    travel_time.append(clock);
    
    // stopover is updated after as it is applied to the duration to the next stop
    stopover_value = parseInt(data['destination_data'][i]['stopover'])*60000;
    // stopover set
    const stopover = document.createElement('div');
    stopover.className = "col";
    try {
      stopover.innerHTML = "Stopover:<br>" + data['destination_data'][i]['stopover']+ " mins";
    }
    catch {
      stopover.innerHTML = "Stopover:<br>none recorded";
    }
    // split lines
    const top_row = document.createElement('div');
    top_row.className = "row border-bottom p-2";

    const bottom_row = document.createElement('div');
    bottom_row.className = "row p-2";
    
    top_row.append(company, address_ref, address_link);

    bottom_row.append(arrival_time, distance, travel_time, stopover);
    active_address_line.append(top_row, bottom_row);
    //
    // append to page
    //
    var active_route = document.querySelector('#active-route');
    // append down arrow
    active_route.append(transition_container);
    active_route.append(active_address_line);
    }
    
 }
  const end_line = document.createElement('div');
  end_line.className = "container p-2 mt-3 text-center h5";
  end_line.innerHTML = "end";
  active_route.append(end_line);
};
//
// set active route banner values
//
function display_origin(company, destination) {
  try {
    document.querySelector('#company-display').innerHTML = company;
  }
  catch {
    document.querySelector('#company-display').innerHTML = "No Company";
  }
  document.querySelector('#start-address-display').innerHTML = destination;
};
//
// set start address
//
var origin_id = "";
function set_start_address(address) {
    id = address.value;
    // sets the global orgin id
    orgin_place_id(id);
    //console.log("address value", id);
    // test
    console.log("global origin id", window.origin_id);
    const start_address = document.querySelector('#start-address');
    start_address.innerHTML = address.value;
    const select_route = document.querySelector('#select-route');
    select_route.disabled = false;

};
//
// set start address and enable route list
//
function orgin_place_id(id){
  // fetch code from saved data to lower google maps access
    origin_id = id;
};
