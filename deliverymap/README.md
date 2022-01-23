# routesaver

Background for the app:

Recently I worked in a role as a van driver. This was a bulk parcel pickup role mostly set commercial customers of varying sizes and Licenced Post Offices. 

This involved:

Drivers. Basically. Pick up and deliver. Van and Truck. Pickup drivers hand sort into categories based on delivery region. Contract delivery drivers received parcels for their postcode. They address sort by hand. Site knowledge is kept with each driver mostly and passed on word of mouth. Each run varied but on average about a dozen pickups on each run.

Van and truck drivers pick up bulk commercial parcels and post. Trucks take pre sorted categorised cages to centralised sorting facilities. These are then sorted by machine. Then distributed for delivery.

For the driver all the route planning was pre scheduled and on spreadsheet with some notes. Address, contact details maybe, pickup time. Printed each day. There was also a folder that ideally carried site specific information but mostly not. Routes had been planned and added to over years and in this organisation there was no in-house software. On top of this during busy periods ad-hoc pickups could be added. This become more common during covid. Xmas also ramped up but as this was in corporate memory was handled by extra hours. It was only based on experience whether they could fit in what was a quite tight schedule for some runs. On top of all this there was a traffic element which could always throw a sideball

The App Idea:

This app was modelled on my role of pickup driver and not the delivery side only. As the route destinations were mostly fixed during planning as quite often a large volume of parcels needed to be picked up. And on time. The app is designed to be used with mostly static routes which increasingly as assets where stretched included extra hops.

The main element of the route that sorted the destinations into the most effecient route is calculated using Google tools based on what is called the Travelling Salesman Problem. This is something I learnt during the course of writing the app.

For this pickup times were excluded to save time on complexity. Stop times were included but actual pickups varied greatly. It was included as a token of this part of the run as it adds to the total run time.
 

Distinctiveness and Complexity:

Distinctiveness - The app has 2 parts. One is to capture information using Django strengths in content management. Data normally kept by individuals like contact numbers, site access maps etc. Second is to be able to use Google apis to calculate the best route by exhaustive comparisons. And also visual feedback using maps and markers to quickly check location data.


Complexity - complexity is how the software saves mutliple routes calculated from a matrix of distances exhaustively and provides the quickest route. This can also be used to make variations. While this covers single routes the tools uses allow for multiple vehicles. Also it may not be possible

Reflection on how complex could it get. This was designed around what were mostly static routes with adhoc jobs tacked on. Without going into time issues my thought is 
there is a great potential available in making all routes dynamic on a day to day basis. For example the OR-Tools allow for multiple vehicles which means have a
well managed content side would mean routes generated in a way that would make a big impact on effeciencies. It would also mean and without going into
it the system would be less likely to be gamed increase break times. Which can be a common occurence in large organisations. As I researched further into this area I found companies like Amazon use AI to give out delivery routes to drivers. 

Mobile Responsiveness:

Bootstrap is used to create a website responsive to screen size. Combined with @media queries in CSS

What is contained in each file created:

Javascript:

active-route-map-pins.js - add pins to the active route. index.html
active-route-map.js - generate the route map of the active route in a modal window. index.html
active-route.js - set start address, generate the html elements of the active route. index.html
address.js - creates address html elements to display on address.html
company.js - creates company details and images html elements to display on company_details.html
get-cookie.js - javascript/fetch cross-site imprementation 
google-places.js - autocompletes address input using the google places API
location-details.nav.js - obsolete?
route-pins.js - previews address location on map when addresses added to route
route.js - add or remove companies, create html elements to display on route.html
toggle-form-display.js - common function to show/hide input forms for addresses, routes, compinies

Templates:

address.html - address form and list of addresses. addresses will not show on routes without a company object
company_details.html - show a companies details including images.
edit_route.html - add and remove companies that contain addresses
help.html - basic run down how each page works
index.html - the main page where the active route is displayed. the route map is displayed on top in a modal window
layout.html - template layout file
list_companies.html - add companies. these can be added without addresses
log.html - lists csv files saved when routes are generated. very simple implementation for backup and testing
login.html - std (course code) login page
profile.html - a simple user profile page
register.html - std user registration page
route.html - create route form. multiple companies/addresses can be added
upload_file.html - upload an image file


Python:

admin.py - User, Address, Route, Company, Image
apps.py
forms.py - AddressForm, CompanyForm, FileUploadForm, RouteForm, EditRouteForm

functions.py - file upload
             - duration matrix calculated for OR-Tools
             - print_solution function returns the original array in the sorted order. eg 0 -> 2 -> 1 -> 3 -> 0. 0 being the origin, create
             - csv log file for testing and backup of routes
               
models.py - Address, Route: has companies, Company: has address, has images, Image
tests.py
urls.py 

views.py
  def index(request): - display active route list, 
  def get_place_id(request, id): -
  def route(request, route_id="none"): - create a route
  def edit_route(request, route_id): - add and remove companies from route
  def load_route(request, route_id): -
  def load_route_companies(request, route_id): -
  def load_addresses(request): -
  def address(request): - add addreses
  def list_companies(request, company_id='none'): - add and list companies
  def show_company_details(request, company_id="none"): - show company details including images
  def edit_company_details(request, company_id, command): - delete images
  def upload_file(request, company_id="none"): - upload image file
  def file_delete(request, company_id, file_id): -
  def download_file(request, filename): - process csv to download file
  def log(request): - csv files created from active route
  def help(request): - readme text
  def login_view(request): - standard user login
  def logout_view(request): - standard user logout
  def register(request): -  
  def profile(request): -
    


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

Cost of accessing the Google Maps API.

Test data for route calculation.

Testing of how efficient the routing is. My thought is checking against other software wasnt a real indicator as accuracy is 
hard to measure. Without feedback from running routes.

Travel mode is not functional



