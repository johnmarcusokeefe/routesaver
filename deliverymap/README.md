# routesaver

Background for the app:

I worked in a role as a van driver. This was a bulk parcel pickup role mostly set commercial customers and some adhoc 'boutique' businesses and Licenced Post Offices. 

This involved:

Drivers. Basically. Pick up and deliver. Van and Truck. Pickup drivers hand sort into categories based on delivery region. Contract delivery drivers received parcels for their postcode. They address sort by hand. Site knowledge is kept with each driver mostly and passed on word of mouth. Each run varied but on average about a dozen pickups on each run.

Van and truck drivers pick up bulk commercial parcels and post. Trucks take pre sorted categorised cages to centralised sorting facilities. These are then sorted by machine. Then distributed for delivery.

For the driver all the route planning was pre scheduled and on spreadsheet with some notes. Printed each day. There was also a folder that ideally carried site specific information but mostly not. Routes had been planned and added to over years and in this organisation there was no in-house software. On top of this during busy periods ad-hoc pickups could be added. This become more common during covid. Xmas also ramped up but as this was in corporate memory was handled by extra hours. It was only based on experience whether they could fit in what was a quite tight schedule for some runs. On top of all this there was a traffic element which could always throw a sideball

The App Idea:

This app was modelled on my role of pickup driver and not the delivery side only. As the route destinations were mostly fixed during planning as quite often a large volume of parcels needed to be picked up. And on time. The app is designed to be used with mostly static routes which increasingly as assets where stretched included extra hops.

The main element of the route that sorted the destinations into the most effecient route is calculated using Google tools based on what is called the Travelling Salesman Problem. This is something I learnt during the course of writing the app. 

Note: Travelling Salesman Problem which lead to finding Googles OR-Tools. The tools based on what is a complex problem to exhaustive calculations to find the best route. 


Distinctiveness and Complexity:

Distinctiveness - Up front this app has strengths in keeping valueable data that traditionally quite often is mostly kept from person to person. Where it is distinctive is the planning part of the app uses algorythms that could not be easily done manually or even obvious with experience. And the potential to extend this like Amazon does use in its delvery systems.

Complexity - complexity is how the software calculates mutliple routes from a matrix of distances and diplays in a human readable way. 

Mobile Responsiveness:

Bootstrap is used to create a website responsive to screen size. Combined with @media queries in CSS

What is contained in each file created:

Javascript:

active-route-map-pins.js - places markers on preview map from the active route in a modal window on the homepage
active-route-map.js -
active-route.js -
address.js - constructs the address dom elements
company.js -
get-company.js - javascript/fetch cross-site imprementation
google-places.js - autocompletes address input using the google places API
location-details.nav.js
route-pins.js - previews address location on map when addresses added to route
route.js - add or remove companies to route
toggle-form-display.js - function to show/hide input forms for addresses, routes

Templates:

address.html - address form and list of addresses. addresses will not show on routes without a company object
company_details.html - show a companies details including images.
edit_route.html - add and remove companies that contain addresses
file.html - upload an image file
help.html - basic run down how each page works
index.html - the main page where the active route is displayed. the route map is displayed on top in a modal window
layout.html - common menus
list_companies.html - add companies. these can be added without addresses
log.html - lists csv files saved when routes are generated. very simple implementation for backup and testing
login.html - std (course code) login page
preview_route.html - ?
profile.html - a simple user profile page
register.html - std user registration page
route.html - create route form. multiple companies/addresses can be added


Python:

admin.py - User, Address, Route, Company, Image
apps.py - not used
forms.py - AddressForm, CompanyForm, FileUploadForm, RouteForm, EditRouteForm
functions.py - file upload, duration matrix to be feed to OR-Tools, print_solution function returns
               the original array in the sorted order. eg 0 -> 2 -> 1 -> 3 -> 0. 0 being the origin, create
               csv log file for testing and backup
models.py - Address, Route: has companies, Company: has address, has images, Image
tests.py - not used
urls.py
views.py
  - index:
  - get_place_id
  - route
  - edit_route
  - load_route
  - load_route_companies
  - load_addresses
  - address: 
  - list_companies
  - show_company_details: display a companies details
  - edit_company_details: remove company image
  - file
  - file_delete
  - download_file
  - log
  - help
  - login_view
  - logout_view
  - register
  - profile


Python packages required: see requirements.txt


How to run your application.

Add address and company. Either can be added first but only companies with address can be added to a route. Create a route and add companies. On home page select starting point and select route.

Any other additional information the staff should know about your project.

Running the application requires a Google cloud account. While there is seemingly large credits 
included with the account with recent changes it is easy to rack up charges. If you require extensive 
access please notify me on johnmarcusokeefe@gmail.com.

The project requires information being feed in a pre planned way. Hence it is divided into processes add address/check address exists, create route/add address, remove addresses from routes

Issues: 

25 stop limit using waypoints in Google maps. 

More options for start point of route. Like just an address or current location.

Costs of accessing the Google Maps API.

Testing routes/shorted because of cost.

Page reload triggering database duplicates

Testing of how effecient the routing is. 

Route export to for example a spreadsheet.

The amount of work reduced code review and cleanup.

Extra packages:

# used to calculate distance matrix server side. https://github.com/googlemaps/google-maps-services-python
googlemaps==4.5.3
# calculate the route order. https://developers.google.com/optimization
ortools==9.1.9490

