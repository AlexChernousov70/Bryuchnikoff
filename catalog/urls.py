from django.contrib import admin
from django.urls import path
from catalog.views import LeadCreateView, ProductListView


urlpatterns = [
    path('order_call/', LeadCreateView.as_view(), name='order_call'),
    path('<slug:slug>/', ProductListView.as_view(), name='product_list'),
]