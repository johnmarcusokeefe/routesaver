map project

takes a list or delivery stops or a 'run'
sorts them sequentially
allows to show on a map
shows multiple runs on map
takes single input
takes data from spreadsheet
will display stats for runs

for this locations will be addresses
locations can have a or multiple delivery points, ie unit numbers
routes are generated dynamically
route stops have options like inactive so on
location can have multiple addresses to allow for multi-storey buildings, close locations

input by spreadsheet csv
input individual addresses
addresses can only be added once
routes can add existing addresses




* relational field

location - added during address input

    -id
    -lat
    -long

address

    -id
    -unit
    -street num
    -street name
    -street type
    -suburb
    -city
    -country
    -added by
    *location

type

    -id
    -title
    -type/private/company etc
    *address

route
    
    -id
    -name
    *address


user

    -id
    *route



