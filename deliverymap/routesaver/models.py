from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
#from django.core.files.storage import FileSystemStorage

# Create your models here.
class User(AbstractUser):
    pass
    

class Address(models.Model):

    # address input checked via javascript google api
    address1 = models.CharField(max_length=100, null=True)
    address2 = models.CharField(max_length=100, null=True)
    city = models.CharField(max_length=30, null=True)
    postcode = models.CharField(max_length=30, null=True)
    state = models.CharField(max_length=30, null=True)
    country_region = models.CharField(max_length=30, null=True)
    #
    place_id = models.CharField(max_length=30, null=True, unique=True)
    lat_lng = models.CharField(max_length=100, null=True)
    place_url = models.CharField(max_length=30, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f'{self.id} {self.address1} {self.address2} {self.city} {self.postcode} {self.state} {self.country_region} {self.lat_lng} {self.place_id} {self.place_url} {self.timestamp}'


class Route(models.Model):
    
    route_name =  models.CharField(max_length=30, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    route_notes = models.CharField(max_length=100, null=True)
    company = models.ManyToManyField('Company')
    timestamp = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f'{self.id} {self.route_name} {self.route_notes} {self.timestamp}'

class Company(models.Model):

    name = models.CharField(max_length=30, null=True)
    contact = models.CharField(max_length=30, null=True)
    phone = models.CharField(max_length=30, null=True)
    instructions = models.CharField(max_length=255, null=True)
    stopover = models.CharField(max_length=30, null=True)
    #
    images = models.ManyToManyField('Image', symmetrical=False, blank=True)
    #
    address = models.ForeignKey(Address, on_delete=CASCADE, blank=True, null=True)
    added_by = models.ForeignKey(User, on_delete=CASCADE, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f'{self.id} {self.contact} {self.phone} {self.instructions} {self.stopover} {self.added_by} {self.timestamp}'


class Image(models.Model):

    title = models.CharField(max_length=255, null=True)
    description = models.CharField(max_length=255, null=True)
    file = models.FileField(upload_to='images/', null=True)
    timestamp = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f'{self.id} {self.title} {self.description} {self.timestamp}'
