//
// remove route id with an alert warning
//
function remove_route(route_id){
  var answer = prompt("Please enter the route ID to delete: "+route_id+" ?");
  if( answer == route_id ) {
     window.open("/route/"+route_id+"/")
  }
  else {
    console.log("wrong id");
  }
};
//
// add route address
//
var route_id = "";
// view is setup to toggle
function route_add_company(route_id) {
    const csrftoken = getCookie('csrftoken');
   
    company_id = document.getElementById("select-company").value;
    route_id=route_id;
    data = {'company_id': company_id}
        fetch('/edit_route/'+route_id+'/', {
            method: 'PUT',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin', // Do not send CSRF token to another domain.
            body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(data => {
            // data not used only calls function
            console.log('Success route add:', data);
            document.querySelector('#route-companies').innerHTML = "";
            // load address list
            //data.forEach(create_route_company_list);
            load_route_companies(route_id); 
          })
          .catch(error => {
            console.error('Error:', error);
      });
};
//
// dynamically removes address from route
//
function route_remove_company(route_id, company_id) {
    const csrftoken = getCookie('csrftoken');
   
    data = {'company_id': company_id};
      fetch('/edit_route/'+route_id+'/', {
          method: 'DELETE',
          headers: {'X-CSRFToken': csrftoken},
          mode: 'same-origin', // Do not send CSRF token to another domain.
          body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          //console.log('remove Success length:', data);
          document.querySelector('#route-companies').innerHTML = "";
          //data.forEach(create_route_company_list);
          load_route_companies(route_id);   
        })
        .catch(error => {
          console.error('Error:', error);
    });   
}
//
// load companies to select
//
function add_options(option_list) {
    console.log("option list",option_list);
    var select_company = document.querySelector('#select-company');
    select_company.innerHTML = "";
    const option = document.createElement("option");
      option.value = 'none';
      option.text = "Add Company";
      //console.log(option_list[i]);
      select_company.add(option);  
      for(var i = 0; i < option_list.length; i++){
        // only companies with an address can be added
        if(option_list[i]['address__address1'] != null) {
          const option = document.createElement("option");
          option.value = option_list[i]['id'];
          option.text = option_list[i]['name'] + " : " + option_list[i]['address__address1']+" "+option_list[i]['address__city'];
          //console.log(option_list[i]);
          select_company.add(option);  
        }
        
    }
};
//
// called from edit_route.html
//
function load_route_companies(route_id) {
  fetch('/load_route_companies/'+route_id+'/')
    .then(response => response.json())
    .then(data => {
      console.log('edit route Success:', data);
      // build the address list
      document.querySelector('#route-companies').innerHTML = "";
      //
      data[1].forEach(create_route_company_list);
      //console.log("select company", select_company, data[0]);
      add_options(data[0]);
    })
    .catch(error => {
      console.error('Error:', error);
  });
};
//
// create company list for edit route etc edit_route.html
//
function create_route_company_list(company_list) {
  // needs to update drop down list too as it is call from all
  //console.log("create route company list", company_list);
  // moved as should update the map each time
  if(company_list['id'] == null) {
     console.log("no companies to show");
  }
  else {
    route_id = document.querySelector('#route-id').innerHTML;
    route_company_list = document.querySelector('#route-companies');
    //
    // get the data values 
    const li = document.createElement('li');
    li.className = "border-bottom row p-2";
    li.dataset.latlng = company_list['address__lat_lng'];
    //
    const company_div = document.createElement('div');
    company_div.className = "col-10";
    let company = company_list['name'];
    let street = company_list['address__address1'];
    let state = company_list['address__state'];
    let city = company_list['address__city'];
    let postcode  = company_list['address__postcode'];
    let address_text = company + ": "+street + " " + state +" "+ city +" "+ postcode;
    if(company_list['address__address1'] == null) {
      address_text = company + ": no address";
      li.className = "border-bottom row text-danger p-2";
    } 
    //
    company_div.innerHTML = address_text;
    //
    li.append(company_div);
    const control_div = document.createElement('div');
    control_div.className = "col-1";
    const link_button = document.createElement('button');
    link_button.className = "btn btn-sm btn-outline-secondary float-right";
    link_button.innerHTML = "remove";
    // delete link for the address line
    const company_id = company_list['id'];
    link_button.addEventListener("click", function() { 
        // 0 is index for the id
        route_remove_company(route_id, company_id);
        setTimeout(function(){ showMap(); }, 800);
    });
    
    li.append(company_div, link_button, control_div);
    // append to page
    route_company_list.append(li);
  }
};
