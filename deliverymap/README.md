# routesaver

Background for the app:

In a past role I worked as a van driver and picked up commercial parcels and mail on postal routes. This was a bulk parcel pickup run with say a dozen pickups from commercial customers and Licensed Post Offices. 

This involved:

For the driver all the route planning was pre scheduled and on spreadsheet with some notes. Address, contact details maybe, pickup time. Printed each day. There was also a folder that ideally carried site specific information but was always out of date. Routes had been planned and added to over years and in this organisation there was no in-house route planning software. On top of this during busy periods ad-hoc pickups could be added. This become more common during covid. Xmas also ramped up but as this was in corporate memory and was handled by extra hours. It was only based on experience whether they could fit in what was a quite tight schedule for some runs. On top of all this there was a traffic element which could always effect runs greatly.

The App Idea:

The idea was to create a simple app to store addresses and groups of addresses in routes that could be used to calculate runs using Google maps javascript and Python API. And Django to store the information that can be linked to the location data. At this point I had no knowledge of the extent of tools available. A large amount of work went into researching these tools. 

The main element of the route that sorted the destinations into the most effecient route is calculated using Google tools based on what is called the Travelling Salesman Problem. This is something I learnt during the course of writing the app.

Distinctiveness and Complexity:

Distinctiveness - The app has 2 parts. First is to capture information using Django strengths in content management. Data normally kept by individuals like contact numbers, site access maps etc. Second is to be able to calculate the best route by using duration and feedback total values. And also visual feedback using maps and markers. To start my aim was to make an app that reflected a real world process and could be used as part of this process. The other distinct feature that is unique is the the ability to calculate the route and link the content to the location data to that. So database instead of folder/spreadsheet.

To achieve the route calculations it uses Google OR-Tools which are based on the travelling salesman problem. This takes a matrix of distances and exhaustively checks for the best solution. To link the data it uses Django strengths in content as learnt in the course.

Travellng Salesman Problem: https://en.wikipedia.org/wiki/Travelling_salesman_problem

About Google OR-Tools https://developers.google.com/optimization/introduction/overview


Complexity - The software saves mutliple routes calculated from a matrix of distances exhaustively and provides the quickest route. This can also be used to make variations. Maps and markers are generated from the Google Maps API. There is also the linking of the site data to the location. The data structure is saved as Company with addresses and images as many to many fields. Both can be created seperately but companies are tested for addresses and will not be loaded without in the active route selector. There is also added complexity by linking to Gooogles API's to calculate the route list and to display maps and markers.


Mobile Responsiveness:

Bootstrap is used to create a website responsive to screen size. Combined with @media queries in CSS.
 
- Small devices @media (min-width: 576px) 
- Medium devices (tablets, 768px and up)
- Large devices (desktops, 992px and up)
- Extra large devices (large desktops, 1200px and up)

What is contained in each file created:

Javascript:

active-route-map-pins.js - add pins to the active route map that is displayed in modal window. index.html
active-route-map.js - generate the route map of the active route in a modal window. index.html
active-route.js - set start address, generate the html elements of the active route. index.html
address.js - creates address html elements to display on address.html
company.js - creates company details and images html elements to display on company_details.html
get-cookie.js - javascript/fetch cross-site imprementation for javascript
google-places.js - autocompletes address input using the Google Places API
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
log.html - lists csv files saved when routes are generated. very simple implementation which generates a file list from the folder
login.html - std (course code) login page
profile.html - a simple user profile page
register.html - std user registration page
route.html - create route form. multiple companies/addresses can be added
upload_file.html - upload an image file


Python:

admin.py - User, Address, Route, Company, Image
apps.py
forms.py - AddressForm , CompanyForm, FileUploadForm, RouteForm, EditRouteForm - add and remove addresses
functions.py - extra functions 
             - file upload
             - duration matrix calculated for OR-Tools
             - print_solution function returns the original array in the sorted order. eg 0 -> 2 -> 1 -> 3 -> 0. 0 being the origin, create
             - csv log file for testing and backup of routes             
models.py - Address, Route: has companies, Company: has addresses and images, Image
tests.py
urls.py 

views.py
  def index(request): - display active route list, 
  def get_place_id(request, id): - not used
  def route(request, route_id="none"): - create a route
  def edit_route(request, route_id): - add and remove companies from route
  def load_route(request, route_id): - loads route objects into active route
  def load_route_companies(request, route_id): - edit_route.html load companies for the route
  def load_addresses(request): - json call to load addresses
  def address(request): - add addresses
  def list_companies(request, company_id='none'): - add and list companies
  def show_company_details(request, company_id="none"): - show company details including images
  def edit_company_details(request, company_id, command): - delete images
  def upload_file(request, company_id="none"): - upload image file
  def file_delete(request, company_id, file_id): -
  def download_file(request, filename): - process csv to download file
  def log(request): - csv files created from active route and saved into media folder. overwrites route until new date 
  def help(request): - some basic explainations of the pages
  def login_view(request): - standard user login from django
  def logout_view(request): - standard user logout from djano doc
  def register(request): -  standard registration code from django
  def profile(request): - display user profile. driver information can also be collected but not for this assignment
    

Python packages required: see requirements.txt

How to run your application.

Add address and company. Either can be added first but only companies with address can be added to a route. Create a route and add companies. On home page select starting point and select route.

Any other additional information the staff should know about your project.

Running the application requires a Google cloud account. While there is seemingly large credits 
included with the account with recent changes it is easy to rack up charges. If you require extensive 
access please notify me on johnmarcusokeefe@gmail.com.

The project requires information being feed in a pre planned way. Hence it is divided into processes add address/check address exists, create route/add address, remove addresses from routes.

Also a Google cloud key is required to access their API. Currently there is a key embedded in the project and should run in the code provided. 

Note: All test data was created by searching local businesses who may or may not have pickups from my former employer. The origin is not a hub I know of and the addresses were just picked randomly by Google search.

Issues: 

25 stop limit using waypoints in Google maps. 

Cost of accessing the Google Maps API.

Time to test with alternative routing methods.

Limited editing.

Limited information on route map.

No backups and editing history. Some editing is left as admin function as a safety net.

Scope to add features:

This app has scope to expand with more features especially dynamic in nature. It is worth mentioning some of these and there would be more. fuel stop options, multiple vehichles with dynamic route planning, live feedback, incident reporting, comprehensive logs.
