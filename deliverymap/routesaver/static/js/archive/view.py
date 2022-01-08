  # for count, item in enumerate(matrix_response['rows'][0]['elements']):  
        #     route_address_list[count]['distance_value'] = item['distance']['value']
        #     route_address_list[count]['duration_value'] = item['duration']['value']
       
        # if route_address_list[0]['address__place_id'] == start_address_id:
        #     route_address_list = route_address_list[1:]

        # #print("route address list",route_address_list)
        # # get company data
        # companies = []
        # for address in route_address_list:
        #     address_object = Address.objects.get(pk=address['address__id'])
        #     company_search = Company.objects.filter(address=address_object)
        #     if company_search:
        #         companies.append(company_search.values())
        #     else:
        #         companies.append([{ 'name':"no company"}])
            
        # # Look up an address with reverse geocoding
        # # reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))

        # waypoints = []
        # #print("route address list", route_address_list)
        # # add lat/long values of addresses
        # for address in route_address_list:
        #     waypoints.append(address['address__lat_lng'])
         
        # # get the lat/lng from the database
        # start_query = Address.objects.filter(place_id=start_address_id).values('lat_lng')
        # start = start_query[0]['lat_lng']
        # print(len(waypoints))
        # if(len(waypoints) > 0):
        #     finish = waypoints.pop()
        # else:
        #     finish = start
   
        # # need to get departure input
        # gmaps_response = gmaps.directions(start,
        #                             finish,
        #                             mode="driving",
        #                             waypoints=waypoints,
        #                             departure_time=departure_time) 
        
        # #
        # #                             
        # # used for address list only with javascript tracing route
        # #
        # # add company data. company sort order?
        # i = 0
        # for leg in gmaps_response[0]['legs']:
        #     leg['company'] = list(companies[i])
        #     i = i+1

        # pass the address and create company with that address, if company exists just add address
# @csrf_exempt
# @login_required
# def add_company_with_address(request, address_id='none'):

#     companies_list = Company.objects.all()
#     company_form = CompanyForm()

#     print("address id", address_id, request.POST )
#     address = Address.objects.get(pk=address_id)
    
#     # address list for adding company. should only show 
#     address_list = Address.objects.all()
#     address_list_no_company = []
#     for address in address_list:
#         if Company.objects.filter(address=address):
#             print("company already is assigned to company")
#         else:
#             address_list_no_company.append(address)

    
#     if request.method == "POST":
#         #
#         # address id from company form
#         print(request.POST)
#         address_id = request.POST.get('address_id', "none") 

#         # get company details by address
#         if address_id != "none":
#             address = Address.objects.get(pk=address_id)
#             company_details = Company.objects.filter(address=address)
#         else:
#             if address_id == "none":
#                 user_id = User.objects.filter(username=request.user).values('id')
#                 user = User.objects.get(pk=user_id[0]['id'])
#                 name=request.POST.get('name')
#                 contact=request.POST.get('contact')
#                 phone=request.POST.get('phone')
#                 instructions=request.POST.get('instructions')
#                 #
#                 if address_id == "none":
#                     new_details = Company(name=name, contact=contact, phone=phone, instructions=instructions, added_by=user)
#                     new_details.save()
#                 else:    
#                     new_details = Company(name=name, contact=contact, phone=phone, instructions=instructions, added_by=user, address=address)
#                     new_details.save()

#     return render(request, "routesaver/add_company.html", {
#         "id":id,
#         "address_list": address_list_no_company,
#         "companies_list": companies_list,
#         "company_details_form": company_form
#     })

# # add previously created company to address
# @csrf_exempt
# @login_required
# def add_remove_address_company(request, company_id, address_id):

#     print("add company to address if no address and remove if has address")

#     companies_list = Company.objects.all()
#     company_form = CompanyForm()
#     if request.method == "POST":
#         address_id = request.POST['address_id_add']
#     address = Address.objects.get(pk=address_id)
#     company_address = Company.objects.filter(address=address)
#     company = Company.objects.get(pk=company_id)
    
#      # add address to company from existing company
#     if company_address:
#         print("remove address 521")
#         company.address = None
#         company.save()
#     else:
#         company.address = address
#         company.save()
   

#     # address list for adding company. should only show 
#     address_list = Address.objects.all()
#     address_list_no_company = []
#     for address in address_list:
#         if Company.objects.filter(address=address):
#             print("company already is assigned to company")
#         else:
#             address_list_no_company.append(address)
#     #
   
    
#     return render(request, "routesaver/add_company.html", {
#         "id": "none",
#         "address_list": address_list_no_company,
#         "companies_list": companies_list,
#         "company_details_form": company_form
#     })
