# extra functions
import os
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
    #row_list = [row['elements'][j]['duration']['text'] for j in range(len(row['elements']))]
    row_list = [row['elements'][j]['duration'] for j in range(len(row['elements']))]
    duration_matrix.append(row_list)
    
  data['duration_matrix'] = duration_matrix
  data['num_vehicles'] = 1
  data['depot'] = 0
  return data


# build an array from distance matrix for calc route
def build_distance_matrix(response):

  distance_matrix = []
  data = {}

  for row in response['rows']:
    row_list = [row['elements'][j]['distance']['value'] for j in range(len(row['elements']))]
    distance_matrix.append(row_list)
    
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
    print(plan_output)
    plan_output += 'Route distance: {}miles\n'.format(route_distance)
    # my code
    index_array.append(0);
    return index_array