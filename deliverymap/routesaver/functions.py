# extra functions
from distutils.log import error
import json
from logging import exception
import os
from textwrap import indent
from django.core.files import File
from datetime import datetime

# check if address id directory exists and create if not then write 
def handle_uploaded_file(f, path, filename="none"):
    
    if os.path.isdir:
        print("directory exists")
    else:    
        os.mkdir(path)

    if filename == "none":
        filename = str(datetime.now().isoformat())
        filename = filename + ".jpeg"

    with open( path+"/"+filename, 'wb+') as destination:
        for chunk in f.chunks():
           
            destination.write(chunk)

# build an array from duration matrix for calc route
def build_duration_matrix(response):

  duration_matrix = []
  data = {}
  
  for row in response['rows']:
    # duration in traffic is not always available
    try:
        row_list = [row['elements'][j]['duration_in_traffic'] for j in range(len(row['elements']))]
    except:
        row_list = [row['elements'][j]['duration'] for j in range(len(row['elements']))]
    duration_matrix.append(row_list)
  #
  # duration matrix is accessed later to display on page durations. access is by index
  #   
  data['duration_matrix'] = duration_matrix
  data['num_vehicles'] = 1
  data['depot'] = 0
  return data


# build an array from distance matrix for calc route
def build_distance_matrix(response):

  distance_matrix = []
  data = {}

  for row in response['rows']:
    # for testing
    try:
        row_list = [row['elements'][j]['distance']['value'] for j in range(len(row['elements']))]
        distance_matrix.append(row_list)
    except:
        print("build distance error", row_list)

  data['distance_matrix'] = distance_matrix
  data['num_vehicles'] = 1
  data['depot'] = 0
  return data

    
# return list(matrix_out)
def print_solution(manager, routing, solution):
    
    index_array = []
    print('Objective: {} miles'.format(solution.ObjectiveValue()))
    index = routing.Start(0)
    plan_output = 'Route for vehicle 0:\n'
    route_distance = 0
    while not routing.IsEnd(index):
        # my code
        index_array.append(index);
        #
        plan_output += ' {} ->'.format(manager.IndexToNode(index))
        previous_index = index
        index = solution.Value(routing.NextVar(index))
        route_distance += routing.GetArcCostForVehicle(previous_index, index, 0)
        
    plan_output += ' {}\n'.format(manager.IndexToNode(index))
    
    plan_output += 'Route distance: {}miles\n'.format(route_distance)
    #
    # appends the origin node to the list to allow return. this is to aways return/display the origin as the last destination
    #
    index_array.append(0)
    # *****
    return index_array
#
# create a csv of the current route
#
def create_route_csv(route_id, route_list_in):

  file_date = datetime.now()
  
  route_list_data = []
  path = os.getcwd() + "/routesaver/media/csv/"
  for address in route_list_in['destination_data']:
      route_list_data.append(address)
  # remove return address
  #print("route list data pop", route_list_data)
  route_list_data.pop()
  #
  with open(path+"routeid-"+route_id+"--"+file_date.strftime("%d.%m.%Y")+".csv", 'w') as f:
      myfile = File(f)
      header = "company name, address\n"
      myfile.write(header)
      for line in route_list_data:
          company_name = line['name']
          address = line['address__address1'] + " "+  line['address__city']+ " " + line['address__state'] + " " + line['address__postcode']
       
          myfile.write(company_name + "," + address+"\n")
  
  myfile.closed
  f.closed