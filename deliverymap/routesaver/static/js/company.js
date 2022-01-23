//
// display company details
//
function company(company_id) {
  
  const csrftoken = getCookie('csrftoken');
  
  var data = {'company_id': company_id};
  //console.log(data);
  fetch('/company_details/', {
    method: 'POST', // or 'PUT'
    headers: {'X-CSRFToken': csrftoken},
    mode: 'same-origin', // Do not send CSRF token to another domain.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
   })
  .then(response => response.json())
  .then(data => {
      //console.log('company success', data);
           if(data['company_details'] == false){
                console.log("no company details");
                // stops display of previous selection data
                document.querySelector('#company-details').innerHTML = "";
                document.querySelector('#company-images').innerHTML = "";
           }
           else {
                document.querySelector('#company-details').innerHTML = "";
                document.querySelector('#company-images').innerHTML = "";
                if(data['company_details'] == 'NoID'){
                  console.log("no id");
                }
                else {
                  // this contains address [0] and company [1]
                  load_company_details(data);
                }
                
           }
          
    })
    .catch(error => {
      console.error('Error:', error);
  });
}

//
// set stop duration
//
function set_stop_value(stop_value, company_id) {
  
  var data = { 'stop_value': stop_value, 'company_id': company_id}
  fetch('/company_details/', {
    method: 'PUT', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
   })
  .then(response => response.json())
  .then(data => {
      console.log('put success', data);
           
    })
    .catch(error => {
      console.error('Error:', error);
  });
}
//
// construct the details list
//
function load_company_details(data) {

  address = data[0][0]
  //console.log("data", data)
  // clean up data references
  detail_data = data[1];
  //
  image_data = data[2];
  
  //clean_data = data[0]['fields'];
  //console.log("company and image", detail_data, image_data);
    
    var company_details = document.querySelector('#company-details');
    var company_images = document.querySelector('#company-images');
    company_images.innerHTML = "";
    
    // test if any details exist
    if(detail_data) {
        // details
        if(data['name'] == "") {
          document.querySelector('#add-details-form').style.display = 'block'; 
        }
        else
        {
          //document.querySelector('#add-details-form').style.display = 'none';
        var name_row = document.createElement('div');
        name_row.className ="d-flex flex-row";

        var name_label = document.createElement('div');
        name_label.className = "pl-3 p-2 col-2 font-weight-bold text-right";
        name_label.innerHTML = "Name: ";
        
        var name_div = document.createElement('div');
        name_div.className = "pl-3 p-2";
        name_div.innerHTML = detail_data[0]['name'];

        name_row.append(name_label, name_div);
        //
        var address_row = document.createElement('div');
        address_row.className ="d-flex flex-row";

        var address_label = document.createElement('div');
        address_label.className = "pl-3 p-2 col-2 font-weight-bold text-right";
        address_label.innerHTML = "Street Address: ";
        
        var address_div = document.createElement('div');
        address_div.className = "pl-3 p-2";
        var has_address = true;
        if (address['address1'] == undefined){
          address_div.innerHTML = "no address";
          has_address = false;
        } else {
          address_div.innerHTML = address['address1']+" "+address['city']+" "+address['postcode'];
        }
        
        const remove_address = document.createElement('a');
        remove_address.className = "remove-address pt-2 ml-2";
        remove_address.innerHTML = "remove";
        remove_address.href = "/company_details/"+detail_data[0]['id']+"/delete/";
        if( has_address == false) {
          address_row.append(address_label, address_div);
        } else {
          address_row.append(address_label, address_div, remove_address);
        }
        
        //
        var contact_row = document.createElement('div');
        contact_row.className ="d-flex flex-row";

      var contact_label = document.createElement('div');
      contact_label.className = "pl-3 p-2 col-2 font-weight-bold text-right";
      contact_label.innerHTML = "Contact: ";
      
      var contact_div = document.createElement('div');
      contact_div.className = "pl-3 p-2";
      contact_div.innerHTML = detail_data[0]['contact'];

      contact_row.append(contact_label, contact_div);

//
        var phone_row = document.createElement('div');
        phone_row.className = "d-flex flex-row";

        var phone_label = document.createElement('div');
        phone_label.className = "pl-3 p-2 col-2 font-weight-bold text-right";
        phone_label.innerHTML = "Phone: ";

        var phone_div = document.createElement('div');
        phone_div.className = "pl-3 p-2";
        phone_div.innerHTML = detail_data[0]['phone'];
         
        phone_row.append(phone_label, phone_div);
        //
        var desc_row = document.createElement('div');
        desc_row.className = "d-flex flex-row";

        var desc_label = document.createElement('div');
        desc_label.className = "pl-3 p-2 col-2 font-weight-bold text-right";
        desc_label.innerHTML = "Description: ";

        var desc_div = document.createElement('div');
        desc_div.className = "pl-3 p-2";
        desc_div.innerHTML = detail_data[0]['instructions'];
        
        desc_row.append(desc_label, desc_div);
        // input for stopover
        var stop_row = document.createElement('div');
        stop_row.className = "d-flex flex-row mb-2";
        
        var stop_label = document.createElement('div');
        stop_label.className = "pl-3 p-2 col-2 font-weight-bold text-right";
        stop_label.innerHTML = "Stopover: ";
        console.log("stopover",detail_data[0]['stopover'])
        var stop_choice = [1,2,5,10,15,30,60];
        var stop_select = document.createElement('select');
        //
        stop_select.onchange = function() {
          console.log("update stop value");
          set_stop_value(this.value, detail_data[0]['id']);
        };
        stop_select.className = "ml-3 p-2";
        
        
        // add defaults
        const stop_option = document.createElement('option');
        stop_option.text = "Default 0";
        stop_option.value = 0;
        stop_select.add(stop_option, 0);
        for(var i=0; i < stop_choice.length; i++){
           //console.log(stop_choice);
           const stop_option = document.createElement('option');
           stop_option.text = stop_choice[i] + " mins";
           stop_option.value = stop_choice[i];
           stop_select.add(stop_option, stop_choice[i]);
        }
        // set list value from data if greater than 0
        if(detail_data[0]['stopover'] > 0){
          stop_select.value = detail_data[0]['stopover'];
        }
        //stop_select.value = detail_data[0]['stopover'];
        stop_row.append(stop_label, stop_select);

        // detail line
        company_details.append(name_row, address_row, contact_row, phone_row, desc_row, stop_row);

        }
        //
        // images
        var image_ul = document.createElement('ul');
        var images, image_container, image_text;
   
        // image 
        if (image_data.length < 1) {
          console.log("image data no images");
          const div_row = document.createElement('div');
          div_row.className = "d-flex col-12";

          const no_image_message = document.createElement('div');
          no_image_message.className = "h5 p-2 mx-auto";
          no_image_message.innerHTML = "No images found for this selection";
          div_row.append(no_image_message);
          company_images.append(div_row);
        }
        else 
        {
          for(var i = 0; i < image_data.length; i++){
            //
            console.log("image data", image_data);
            const image_li = document.createElement('li');
            image_li.className = "d-flex flex-row border-bottom";
            // columns
            // image container
            image_container = document.createElement('div');
            image_container.className = "p-3 col-2";
            // image text container
            image_text = document.createElement('div');
            image_text.className = "p-2 col-10";
            
            // image title
            const image_title = document.createElement('div');
            image_title.className = "p-2";
            image_title.innerHTML = "<strong>Title: </strong>" + image_data[i]['title'];
            // image description
            const image_description = document.createElement('div');
            image_description.className = "p-2";
            image_description.innerHTML = "<strong>Description: </strong>"+ image_data[i]['description'];
            // image filename
            const image_filename = document.createElement('div');
            image_filename.className = "p-2";
            image_filename.innerHTML = "<strong>Filename: </strong>" + image_data[i]['file'];

            const image_remove_button = document.createElement('a');
            image_remove_button.innerHTML = "remove";
            image_remove_button.className = "btn btn-outline-danger float-right mt-2";
            
            image_remove_button.href = '/company_details/'+detail_data[0]['id']+'/'+image_data[i]['id']+'/delete/';
            console.log("281", detail_data, image_data);
            
            image_text.append( image_remove_button, image_title, image_description, image_filename);

            const image_link = document.createElement('a');
            image_link.href = "http://127.0.0.1:8000/media/"+ image_data[i]['file'];
            image_link.target = "blank";

            images = document.createElement('img');
            images.className = "img-thumbnail p-2";
            images.src = "http://127.0.0.1:8000/media/"+ image_data[i]['file'];
            images.alt = "image";
            images.width = "200";
            //
            image_link.append(images);
            image_container.append(image_link);
            // append left and rigth columns
            image_li.append(image_container, image_text);
            //
            image_ul.append(image_li);
        }
      }

      company_images.append(image_ul);

    }
    else {
      company_details.innerHTML = "";
      document.querySelector('#add-details-form').style.display = 'block';
    }
    
}