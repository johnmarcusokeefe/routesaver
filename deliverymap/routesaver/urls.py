from django.urls import path
from django.conf import settings

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name='register'),
    path('route', views.route, name="route"),
    path('route/<str:route_id>/', views.route, name="route"),
    path('load_route/<str:route_id>/', views.load_route, name="load_route"),
    path('load_route_companies/<str:route_id>/', views.load_route_companies, name="edit_route"),
    path('edit_route/<str:route_id>/', views.edit_route, name="edit_route"),
    path('load_addresses', views.load_addresses, name='load_addresses'),
    path('address', views.address, name='address'),
    #
    path('list_companies', views.list_companies, name="list_companies"),
    path('list_companies/<str:company_id>/', views.list_companies, name="list_companies"),
    path('company_details/', views.show_company_details, name="show_company_details"),
    path('company_details/<str:company_id>/', views.show_company_details, name="show_company_details"),
    # delete address
    path('company_details/<str:company_id>/<str:command>/', views.edit_company_details, name="edit_company_details"),
    #path('get_place_id/<str:id>/', views.get_place_id),
    path('profile', views.profile, name='profile'),
    path('log', views.log, name='log'),
    path('download/<str:filename>/', views.download_file, name='download_file' ),
    path('help', views.help, name='help'),
    #?
    path('company_details/<str:company_id>/<str:file_id>/delete/', views.file_delete),
    path('upload_file', views.upload_file, name='upload_file'),
    path('upload_file/<str:company_id>/', views.upload_file, name='upload_file')
]