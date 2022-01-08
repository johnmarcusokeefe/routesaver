from django import forms

from .models import Address
#
class AddressForm(forms.Form):

    address_line = forms.CharField(label='Search Address', max_length=100, required=False)
    
    address1 = forms.CharField(label='Address', max_length=30)
    address2 = forms.CharField(label='Address Options', max_length=30, required=False)
    city = forms.CharField(label='City', max_length=100)
    postcode = forms.CharField(label='Postcode', max_length=100)
    state = forms.CharField(label='State', max_length=100)
    country_region = forms.CharField(label='Country/Region', max_length=100)
    #
    lat_lng = forms.CharField(label='Lat/Lng', max_length=100)
    place_id = forms.CharField(label='Place ID', max_length=100)
    place_url = forms.CharField(label='Place URL', max_length=100) 

# company form
class CompanyForm(forms.Form):
    
    name = forms.CharField(label='Company Name', max_length=100, required=True)
    contact = forms.CharField(label='Contact Name', max_length=100, required=False)
    phone = forms.CharField(label='Contact Phone', max_length=100, required=False)
    instructions = forms.CharField(label='Notes/Instructions', widget=forms.Textarea(attrs={'rows': 4,'cols': 60}))

#upload form
class FileUploadForm(forms.Form):
    
    #
    # form inputs
    #
    file = forms.FileField()
    title = forms.CharField(label='Title', max_length=100, required=False)
    #
    description = forms.CharField(label='Image Description', 
        widget=forms.Textarea(attrs={'rows': 4,'cols': 60, 'class': 'form-group'}), required=False)
   

# address starting point added in template
class RouteForm(forms.Form):
    
    route_name = forms.CharField(label='Route Name', max_length=100)
    route_notes = forms.CharField(widget=forms.Textarea())

# address choice in template to keep database control in view
class EditRouteForm(forms.Form):
    
    route_name = forms.CharField(label='Route Name', max_length=100)
    route_notes = forms.CharField(widget=forms.Textarea)
