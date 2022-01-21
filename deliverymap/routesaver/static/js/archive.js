//
// save company details which could be text or images
//
// function add_company() {
//   const csrftoken = getCookie('csrftoken');
   
//   var address_id = document.querySelector('#select-address-id').value;
//   //console.log("details company id", company_id);

//   var name = document.querySelector('#id_name').value;
//   var person = document.querySelector('#id_contact').value;
//   var phone = document.querySelector('#id_phone').value;
//   var instructions = document.querySelector('#id_instructions').value;
  
//   var data = { company_name: name,
//                 contact_person: person,
//                 company_phone: phone,
//                 instructions: instructions };

//   fetch('/company/'+address_id+"/", {
//     method: 'POST', // or 'PUT'
//     headers: {'X-CSRFToken': csrftoken},
//     mode: 'same-origin', // Do not send CSRF token to another domain.
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//    })
//   .then(response => response.json())
//   .then(data => {
//       console.log('company success', data);
//            if(data['company_details'] == false){
//                 console.log("no company details");
//                 document.querySelector('#add-company-form').style.display = 'none';
//                 // stops display of previous selection data
//                 document.querySelector('#company-details').innerHTML = "";
//                 document.querySelector('#company-images').innerHTML = "";
//            }
//            else {
//                 document.querySelector('#company-details').innerHTML = "";
//                 document.querySelector('#company-images').innerHTML = "";
//                 load_company_details(data);
//            }
//            // clear the form data
//            document.querySelector('#id_name').value = "";
//            document.querySelector('#id_phone').value = "";
//            document.querySelector('#id_instructions').value = "";
//     })
//     .catch(error => {
//       console.error('Error:', error);
//   });
// }
//
// delete image
//
// function delete_image(image_id) {
   
  
//   fetch('/file/'+image_id+"/", {
//     method: 'DELETE', // or 'PUT'
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//    })
//   .then(response => response.json())
//   .then(data => {
//       console.log('company success', data);
     
//     })
//     .catch(error => {
//       console.error('Error:', error);
//   });
// }