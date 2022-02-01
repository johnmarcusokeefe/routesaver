from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json, googlemaps, os
import mimetypes
from .functions import build_distance_matrix, build_duration_matrix, create_route_csv, handle_uploaded_file, print_solution

from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

from .models import User, Address, Route, Company, Image
from .forms import AddressForm, CompanyForm, FileUploadForm, RouteForm
#
# Create your views here.
# 
def index(request):
    #
    # a new model is created for the active route this allows actions to be taken during the run
    #
    # example of google maps
    api_key = "AIzaSyCazYnxjbQJQ_LwrIYGy2PHwxrTASV0X6g"
    gmaps = googlemaps.Client(key=api_key)
    route_destination_list = ""
    # print("directions result",directions_result)
    if request.method == "POST":
        
        data = json.loads(request.body.decode("utf-8"))
        origin_id = data['origin_id']
        route_id = data['route_id']
        departure_time = data['departure_time']
        traffic_model = data['traffic_model']
        print("traffic model", traffic_model)
        tolls = data['tolls']
        if tolls == True:
            tolls = 'tolls'
        else:
            tolls = ""

        # get the route address list wo the origin
        #print("departure time", departure_time)
        # have to get companies
        
        route_destination_object = Route.objects.get(id=route_id)
        route_destination_list = route_destination_object.company.values('id','name','stopover','address__id','address__address1','address__city','address__postcode','address__state','address__place_id','address__lat_lng','address__place_url')
        route_start_address = Company.objects.filter(address__place_id=origin_id).values('id','name','stopover','address__id','address__address1','address__city','address__postcode','address__state','address__place_id','address__lat_lng','address__place_url')

        
        # create an array were the route order set by index
        for start_address in route_start_address:
            route_destination_list_array = [start_address]
        # construct the list of data for display    
        for data in route_destination_list:
            
            # remove start address if exists and companies wo addresses
            if data['id'] == route_destination_list_array[0]['id'] or data['address__id'] == None:
                print("address in route matched start")
            else:
                route_destination_list_array.append(data)
                
        route_destination_list = list(route_destination_list)
       
        # save address id's to array and this index can be used to retrieve company data or anything required
        # address ids [15, 16, 17, 18] only returns address ids where there is a company record. otherwise displays as none
        # in the following list 0 and 15 are linked
        # route solution indexes 0 -> 2 -> 1 -> 3 -> 0
        
        address_ids = []
        
        # start address id appended as it may not be in route address list
        # lat long for markers
        start_address = Address.objects.filter(place_id=origin_id).values('id','lat_lng','place_url')
        
        address_ids.append(start_address[0]['id'])
        for address in route_destination_list:
            # test and excludes duplicate if start address is in route
            if (start_address[0]['id'] != address['address__id']):
                address_ids.append(address['address__id'])
                

        # convert queryset to listprint("address ids",address_ids)
        matrix_addresses = []
        # create place id strings
        # add origin address as 0 index is the start and finish point
        start_address = "place_id:"+ origin_id
        # start address at 0 and tested for in route
        matrix_addresses.append(start_address)

        for line in route_destination_list:
            # only add companies that contain an address
            if line['address__place_id'] != None:
                #
                # tests for duplication of start address
                #
                if origin_id != line['address__place_id']:
                    matrix_addresses.append("place_id:"+line['address__place_id'])
                #
                #***************************************
                #

        # print("****************")
        # print("matrix addresses by place id",matrix_addresses) 
        # print("****************")       
        #
        # address 0 or the first in the route address list will the origin
        #
        # test for max response
        #
        print("length of matrix addresses",len(matrix_addresses))
        if len(matrix_addresses) < 10:
            matrix_response = gmaps.distance_matrix(
                matrix_addresses,
                matrix_addresses,
                mode="driving",
                language="en-AU",
                avoid=tolls,
                units="metric",
                departure_time=departure_time,
                traffic_model=traffic_model,
            )
        else:
            print("too many addresses for matrix")
            route_list = Route.objects.filter(user=request.user)
            company_list = Company.objects.all()

            return render(request, "routesaver/index.html", {
                "company_list": company_list,
                "routes": route_list
            })
        # seperates origin addresses for routing calculations
        matrix_response_origin_list = matrix_response['origin_addresses']

        ################# google code
        #print(json.dumps(matrix_response,indent=4))
        # Instantiate the data problem with a distance matrix.
        print("before distance", matrix_response)
        distance_data = build_distance_matrix(matrix_response.copy())
        print("***********")
        # used to get durations only not used to calculate at this point
        print("after distance", matrix_response)
        duration_data = build_duration_matrix(matrix_response)

         # if duration data = duration_data else ...
        #if distance_data = true:
        data = distance_data
        #else:
        #data = duration_data
        
        
        # Create the routing index manager.
        manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
                                            data['num_vehicles'], data['depot'])
        # Create Routing Model.
        routing = pywrapcp.RoutingModel(manager)
        #
        def distance_callback(from_index, to_index):
            # Convert from routing variable Index to distance matrix NodeIndex.
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return data['distance_matrix'][from_node][to_node]
        #    
        transit_callback_index = routing.RegisterTransitCallback(distance_callback)

        # Define cost of each arc.
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

        # Solve the problem.
        solution = routing.SolveWithParameters(search_parameters)
        
        destination_list = []
        # Print solution on console
        if solution:
            destination_list_index = print_solution(manager, routing, solution)
            # seperates the index component
            for index_value in destination_list_index:
                destination_list.append(matrix_response_origin_list[index_value])
            
        
        # print("****************")    
        # print("index line 174",destination_list_index, destination_list)
        # print("****************")
        
        # this returns the address id for the list item in correct order after distance processing        
        #
        # the return address/start address added last      
        #   
        #
        #retrieve distances data is the list of values
        #
        destination_pairs = []
        for i in range(len(destination_list_index)):
            # create tuples to access duration and distance tables   
            try:
                if i-1 > -1:
                    destination_pairs.append([destination_list_index[i-1], destination_list_index[i]])
            except:
                print("Error")
        print("index line 190 destination pairs", destination_pairs)
        #
        # get distance or duration values using index from orgin and destination
        #
        # eg 0 -> 2 -> 1 -> 3 -> 0 
        # [0, 59582, 38993, 38827] duration_data['duration_matrix'][0][2] = 38993
        # [59736, 0, 25001, 21033]
        # [40748, 24728, 0, 9706]
        # [38830, 20892, 9711, 0]
        #
        distance = []
        #duration = []
        duration_in_traffic = []
        #print("duration_data",duration_data)
        for d in destination_pairs:
            duration_in_traffic.append(duration_data['duration_matrix'][d[0]][d[1]] )
            distance.append(distance_data['distance_matrix'][d[0]][d[1]] )

        ################# google code
        # create the destination data list
        destination_data = []
        #
        # takes the calculated route indexes and creates new list using the destination data
        #
        for item in destination_list_index:
            destination_data.append(route_destination_list_array[item])
        
        # print("****************")    
        print("destination list index",destination_list_index)
        # print("****************")
        if len(destination_list_index) > 2:
            data_out = {"destination_data": destination_data, "distance":distance, "duration_in_traffic":duration_in_traffic}
        else:
            data_out = {"destination_data": [], "distance":[], "duration":[]}
  
        
        # csv route log file
        print("data out length", len(data_out))
        if len(destination_list_index) > 2:
            create_route_csv(route_id, data_out)

        return JsonResponse(data_out, safe=False)
    
    
    # post form only displays when logged in
    if request.user.is_authenticated:
        # Redirect to a success page.
        route_list = Route.objects.filter(user=request.user)
        company_list = Company.objects.all()

        return render(request, "routesaver/index.html", {
            "company_list": company_list,
            "routes": route_list
    })
    else:
        # Return an 'invalid login' error message.
        return render(request, "routesaver/login.html")

#
# get place id from saved address id
#
# def get_place_id(request, id):

#     place_id = Address.objects.filter(id=id).values('place_id');
#     return JsonResponse(list(place_id), safe=False)
    
#
# create a route and set as current route to add addresses
#
@login_required
def route(request, route_id="none"):

    route_list = ""
    route_form = RouteForm()
    address_list = Address.objects.all()

    company_list = Company.objects.all()
    for company in company_list:
        print("company", company)

    # an id is only supplied for a delete
    if route_id != "none":

        Route.objects.get(pk=route_id).delete()
    
    # create route
    if request.method == "POST":
        #save route
        route_name = request.POST["route_name"]
        route_notes = request.POST["route_notes"]
        company_list = request.POST.getlist('company')

        route = Route(route_name=route_name,user=request.user,route_notes=route_notes)
        # address instance needed and save required
        route.save()

        for company in company_list:
            company = Company.objects.get(pk=company)
            route.company.add(company)
            route.save()
        
    # without using values() template displays the value of the model name  
    route_list = Route.objects.filter(user=request.user)

    return render(request, "routesaver/route.html", {
        'route_list': route_list,
        'route_form': route_form,
        'address_list': address_list,
        'company_list': company_list
    })

#
# edit route addresses after added
@login_required
def edit_route(request, route_id):

    # # put and delete list addresses through a javascript fetch
    if request.method == "PUT":
        company_id = json.load(request)['company_id']
        route = Route.objects.get(id=route_id)
        company = Company.objects.get(id=company_id)
        # get the address id from the post value
        route.company.add(company)
        route.save()
    # #
    if request.method == "DELETE":
        company_id = json.load(request)['company_id']
        route = Route.objects.get(id=route_id)
        company = Company.objects.get(id=company_id)
        # get the address id from the post value
        route.company.remove(company)
        route.save()
   
    route_values = list(Route.objects.filter(id=route_id).values())
    route_list = Company.objects.all().values('id','name','address__id','address__address1','address__postcode')
    
    if request.method == "GET":    
        print("get")
    # this is for the first page load 
        return render(request, "routesaver/edit_route.html", {
            'route_id': route_id,
            'route_name': route_values[0]['route_name']
        })
    else:
        print("not get")
        return JsonResponse(list(route_list), safe=False)

#
# fetch call to list the route selected on the homepage, this is javascript with
# the aim of using the drop down list to pick the route and display without 
# reloading page
#
@login_required
def load_route(request, route_id):
    
    route_list = Route.objects.filter(id=route_id).values()
    
    return JsonResponse(list(route_list), safe=False)
#
# called from the route.html page edit button
#
@csrf_exempt
@login_required
def load_route_companies(request, route_id):
    print("route id",route_id)
    companies_not_in_route = []
    company_list = Company.objects.all().values('id','name','address__id','address__address1','address__city','address__state','address__postcode')
    # get route id
    route = Route.objects.get(id=route_id)
    route_list = route.company.values('id','name','address__id','address__address1','address__city','address__state','address__postcode', 'address__lat_lng')
    print(len(route_list))
    # create list of companies not in route for selection
    for company in company_list:
        if route.company.filter(id=company['id']):
            print("company in route", company['id'])
        else:
            companies_not_in_route.append(company)
            print("company not in list", company['id'])
            
    #print("companies not and route list", len(companies_not_in_route), len(route_list))
    
    data_array = [ list(companies_not_in_route), list(route_list)]

    return JsonResponse(data_array, safe=False)


# load addresses on address.html page
@csrf_exempt
@login_required    
def load_addresses(request):
        
    address_list = Address.objects.all().values()
    #
    # search for companies attached to the addresses
    for address in address_list:
        
        co_id = Company.objects.filter(address__id=address['id']).values('id','name')
        if co_id:
            address['company_id'] = co_id[0]['id']
            address['company_name'] = co_id[0]['name']
        else:
            address['company_id'] = 'none'
 
    return JsonResponse(list(address_list), safe=False)


# process address input, addresses are checked for an existing location externally 
# and if they exist in database. the are added to the database to allow saving routes
@login_required
def address(request):
    
    address_form = AddressForm()
    address_list = Address.objects.all()

    # get request data
    if request.method == "POST":
        address1 = request.POST["address1"]
        address2 = request.POST["address2"]
        city = request.POST["city"]
        postcode = request.POST["postcode"]
        state = request.POST["state"]
        country_region = request.POST["country_region"]
        lat_lng = request.POST["lat_lng"]
        place_id = request.POST["place_id"]
        place_url = request.POST["place_url"]

        if( Address.objects.filter(place_id=place_id) ):
            print("record exists")
        else:
            address = Address(address1=address1, address2=address2, city=city, postcode=postcode, state=state, country_region=country_region, lat_lng=lat_lng, place_id=place_id, place_url=place_url)
            address.save()

        address_list = Address.objects.all()

    # get request data
    if request.method == "DELETE":
        print("delete")
        # delete address
        id = json.load(request)['address_id']
        address_id = Address.objects.get(pk=id)
        address_id.delete()
        #
        address_list = Address.objects.all().values()
    
        return JsonResponse(list(address_list), safe=False)

    return render(request, "routesaver/address.html", {
        "address_list": address_list,
        "address_form": address_form 
    })
#
# called from javascript onclick event to add company, or display existing details when passing
#
# add company no address, add company and address, delete address from company


# add company 
@csrf_exempt
@login_required
def list_companies(request, company_id='none'):

    print("list companies company id", company_id)
    companies_list = Company.objects.all()
    company_form = CompanyForm()

    # address list for adding company. should only show 
    address_list = Address.objects.all()
    address_list_no_company = []
    message = ""
    
    # need to test which form is sent
    
    if request.method == "POST":
        #
        address_id_new_company = request.POST.get('address_id_new_company', "no-value")
        address_id_listed_company = request.POST.get('address_id_listed_company', "no-value")

        print("new company, listed company", address_id_new_company, address_id_listed_company)

        if address_id_new_company != "no-value":
            # address id from company form
            user_id = User.objects.filter(username=request.user).values('id')
            user = User.objects.get(pk=user_id[0]['id'])
            name=request.POST.get('name')
            contact=request.POST.get('contact')
            phone=request.POST.get('phone')
            instructions=request.POST.get('instructions')
            # 
            if address_id_new_company == 'none': 
                new_details = Company(name=name, contact=contact, phone=phone, instructions=instructions, stopover=0, added_by=user)
                new_details.save()
            else:
                address = Address.objects.get(pk=address_id_new_company)
                new_details = Company(name=name, contact=contact, phone=phone, instructions=instructions, stopover=0, added_by=user, address=address)
                new_details.save()
            
        # add address to existing 
        if address_id_listed_company != "no-value":
            if address_id_listed_company == 'none':
                company_id = 'none'
                message = "please select an address from drop down. if none add addresses"
            else:
                 # add address to existing company
                print("add address existing", company_id)
                company = Company.objects.get(pk=company_id)
                address = Address.objects.get(pk=address_id_listed_company)
                company.address = address
                company.save()
                message = "existing address added";
                company_id = "none";
  
            
            
    # after processing to ensure list is up to date
    for address in address_list:
        if Company.objects.filter(address=address):
            print("company already is assigned to company")
        else:
            address_list_no_company.append(address)
    
    return render(request, "routesaver/list_companies.html", {
        "company_id": company_id,
        "message": message,
        "address_list": address_list_no_company,
        "companies_list": companies_list,
        "company_details_form": company_form
    })
#
# gets the company details and displays if they exist. it is called inline from the template
#
@csrf_exempt
@login_required
def show_company_details(request, company_id="none"):

   
    company_list = Company.objects.all()
    company = "none"
    data = ["none"]
    if company_id == "none":
        company_id = "display"
        
    if request.method == "POST":

        data = json.loads(request.body.decode("utf-8"))
        if data:
           id = data['company_id']
           print("529", id)
        # displaying details
        if data:
            company_object = Company.objects.get(pk=id)
            company = Company.objects.filter(id=id).values()
            images = company_object.images.all().values()
            try:
                address_id = company_object.address.id
                address = Address.objects.filter(id=address_id).values()
                data = [list(address), list(company), list(images)]
            except:
                print("no address")
                data = ["none", list(company), list(images)]      
        else:
            data = {'company_details' : "NoID"}
        # return json response    
        return JsonResponse(list(data), safe=False)

    # change stop value
    if request.method == "PUT":
        data = json.loads(request.body.decode("utf-8"))
        stop_value = data['stop_value']
        company_id = data['company_id']

        company = Company.objects.filter(pk=company_id)
        company.update(stopover=stop_value)
        
        print("put stop value", stop_value, company_id)
        # return the stop value to ajax update list
        #return JsonResponse(list(data), safe=False)
    file_upload_form = FileUploadForm()
    # first load
    return render(request, "routesaver/company_details.html", {
        "company_list": company_list,
        "company_id": company_id,
        "file_upload_form": file_upload_form
    })
#
# delete address from company. command may be used for further editing 
#
@csrf_exempt
@login_required
def edit_company_details(request, company_id, command):

    company_list = Company.objects.all()
    company = Company.objects.get(pk=company_id)
    # removes company from routes if does not contain an address
    # routes = Route.objects.filter(company=company).values()
    # for route in routes:
    #     print("address in routes", route)
    #     route_object = Route.objects.get(pk=route['id'])
    #     route_object.company.remove(company)
    
    # search and remove from routes
    #
    company.address = None
    company.save()

    return render(request, "routesaver/company_details.html", {
        "company_list": company_list,
        "company_id": company_id
    })
#
# upload
#
@csrf_exempt
@login_required
def upload_file(request, company_id="none"):
    
    company_list = Company.objects.all()
    # path is address id
    feedback = "Input details to upload file"
   
    print(request.POST)
    
    if request.method == 'POST':

        company_id = request.POST.get('company-id', None)
        company_name = request.POST.get('company-name', None)

        upload_form = FileUploadForm(request.POST, request.FILES)
        
        if upload_form.is_valid():
            
            #save to database and upload image to folder
            # absolute path
            path = os.getcwd()+"/routesaver/media/images/"
            handle_uploaded_file(request.FILES['file'], path)

            title=request.POST['title']
            description=request.POST['description']

            new_image = Image(title=title, description=description, file=request.FILES['file'])
            new_image.save()
            #
            # add image to company
            #
            #company_id = request.POST['company_id']
            company_object = Company.objects.get(pk=company_id)
            company_object.images.add(new_image)
            # 
            upload_form = FileUploadForm()
            
            # direct to choice of upload another or go to detail
            feedback = "file uploaded successfully"   
            print("upload", company_id)  
            return render(request, "routesaver/company_details.html", {
                "company_id": company_id,
                "company_name": company_name,
                "feedback": feedback,
                "company_list": company_list,
                "file_upload_form": upload_form
            })
    else:
        upload_form = FileUploadForm()
        print("error check")
        
    return render(request, "routesaver/upload_file.html", {
        "company_id": company_id,
        "feedback": feedback,
        "company_list": company_list,
        "file_upload_form": upload_form
    })
#
@login_required
def file_delete(request, company_id, file_id):

    company_list = Company.objects.all()
    print("delete file", company_id, file_id)
    #
    company_object = Company.objects.get(pk=company_id)
    image_object = company_object.images.get(pk=file_id)
    print("company and image to remove", company_object, image_object)
    if company_object.images.remove(image_object):
        feedback = "Image Removed"
    else:
        feedback = "Image not removed"
    
    return render(request, "routesaver/company_details.html", {
        "company_id": company_id,
        "company_list": company_list,
        "feedback": feedback,
    })
# download csv file
def download_file(request, filename):

    # Define Django project base directory
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # Define text file name
    # Define the full file path
    filepath = BASE_DIR + '/routesaver/media/csv/' + filename
    # Open the file for reading content
    path = open(filepath, 'r')
    # Set the mime type
    mime_type, _ = mimetypes.guess_type(filepath)
    # Set the return value of the HttpResponse
    response = HttpResponse(path, content_type=mime_type)
    # Set the HTTP header for sending to browser
    response['Content-Disposition'] = "attachment; filename=%s" % filename
    # Return the response value
    return response
#
# log displays saved route csvs
#
@csrf_exempt
def log(request):
    
    path = os.getcwd() + "/routesaver/media/csv/"
    route_csv_list = os.listdir(path)
    print(route_csv_list)
    for i in range(len(route_csv_list)-1):
        # remove items that contain a leading .
        if route_csv_list[i][0] == ".":
            route_csv_list.pop(i)
    
    return render(request, "routesaver/log.html", {
        "path": path,
        "route_csv_list": route_csv_list
    }) 
#
# help
#
def help(request):

    help_text = "help text for the website"
    
    return render(request, "routesaver/help.html", {
        "help_text": help_text
    }) 
#
# login function taken from project 4
#
def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)
       
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "routesaver/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "routesaver/login.html")
        
#
@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

#
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "routesaver/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "routesaver/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "routesaver/register.html")

#@login_required
def profile(request):

    user = request.user
     
    if user is not None:
    
        user_id = request.user.id
        current_user = User.objects.filter(id=user_id).values()

        return render(request, "routesaver/profile.html", { 
            "username": current_user[0]['username'],
            "email": current_user[0]['email'],
            "last_login": current_user[0]['last_login']
        })
    else:
        return render(request, "routesaver/login.html")
        