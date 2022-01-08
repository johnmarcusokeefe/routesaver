from django.contrib import admin
from .models import User, Address, Route, Company, Image

# Register your models here.
admin.site.register(User)
admin.site.register(Address)
admin.site.register(Route)
admin.site.register(Company)
admin.site.register(Image)
