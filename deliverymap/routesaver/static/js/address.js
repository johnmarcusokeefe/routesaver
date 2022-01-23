//
// load addresses
//
window.addEventListener('DOMContentLoaded', (event) => {
// add date
    
        x = document.querySelector("#date-picker");
        try {
          x.setAttribute("type", "datetime-local");
        }
        catch {
          x = "";
          console.log("line 11 address.js not loaded for this page");
        }
        

        var t = new Date();
        // 0 array adds leading zeros to numbers less than 10
        z_array = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14',
        '15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36',
        '37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60']
        // coverts to iso format with local offset
        var d_str = t.getFullYear() + "-" + (z_array[t.getMonth()+1]) + "-"+ z_array[t.getDate()] +"T" + z_array[t.getHours()]+":"+z_array[t.getMinutes()];
        //yyyy-MM-ddThh:mm
        console.log(d_str);
        x.value = d_str;

});


function load_addresses() {
  fetch('/load_addresses')
        .then(response => response.json())
        .then(data => {
          // build the address list
          //document.querySelector('#addresses').innerHTML = "";
          data.forEach(address_list);
        })
        .catch(error => {
          console.error('Error:', error);
       
      });
};
//
// delete address
//
function delete_address(id){
  const csrftoken = getCookie('csrftoken');

  data = {'address_id':id};
  console.log("function remove", data);

  fetch("address", {
    method: 'DELETE',
    headers: {'X-CSRFToken': csrftoken},
    mode: 'same-origin', // Do not send CSRF token to another domain.
    body: JSON.stringify(data),
  })
  .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          // build the address list
          document.querySelector('#addresses').innerHTML = "";
          data.forEach(address_list);
        })
        .catch(error => {
          console.error('Error:', error);
       
      });
};
//
// address
//
function edit_address(id){
  const csrftoken = getCookie('csrftoken');

  data = {'address_id':id};

  fetch("address", {
    method: 'PUT',
    headers: {'X-CSRFToken': csrftoken},
    mode: 'same-origin', // Do not send CSRF token to another domain.
    body: JSON.stringify(data),
  })
  .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          // build the address list
        })
        .catch(error => {
          console.error('Error:', error);
      });
};
//
// construct address list
//
function address_list(address) {
    
    console.log("address list", address);
    // need to check if has details and 

    const addresses = document.querySelector('#addresses');
    //
    // address line
    //
    const address_list = document.createElement('div');
    address_list.className = "border-bottom row p-2 m-0";

    const ref_no = document.createElement('a');
    ref_no.className = "col-3";

    if(address.company_id == "none") {
      ref_no.href = "list_companies/"+address.id+'/';
      ref_no.innerHTML = "add";
    }
    else {
      ref_no.href = "company_details/"+address.company_id+'/';
      ref_no.innerHTML = address.company_name;
    }
    
    const street_no = document.createElement('a');
    street_no.className = "col-5";
    street_no.innerHTML = "<u>"+address.address1 + ", " + address.city+"</u>";
    street_no.href = address.place_url;
    street_no.target = "blank";

    const map_icon = document.createElement('span');
    map_icon.className = "material-icons";
    map_icon.innerHTML = "link";

    street_no.append(map_icon);

    const state = document.createElement('div');
    state.className = "col-1";
    state.innerHTML = address.state;

    const postcode = document.createElement('div');
    postcode.className = "col-2 text-center";
    postcode.innerHTML = address.postcode;

    const country = document.createElement('div');
    country.className = "col-1";
    country.innerHTML = address.country_region;
    
    //
    // address detail pane ===================================
    //
    const detail_row = document.createElement('div');
    detail_row.className = "";
    detail_row.id = address.id;
    detail_row.style.display = "none";
    // 
    const detail_title = document.createElement('div');
    detail_title.className = "";
    detail_title.innerHTML = "Detail Pane"
    // contact
    const contact_name = document.createElement('div');
    contact_name.className = "";
    contact_name.innerHTML = "Name"
    // phone
    const phone = document.createElement('div');
    phone.className = "";
    phone.innerHTML = "Phone" 
    // description
    const description = document.createElement('div');
    description.className = "";
    description.innerHTML = "Description" 
    // image
    const image = document.createElement('div');
    image.className = "";
    image.innerHTML = "Image";
    //
    // append append append
    //
    detail_row.append(detail_title, contact_name, phone, description, image);

    address_list.append(ref_no, street_no, state, postcode, country);

    addresses.append(address_list);
}
