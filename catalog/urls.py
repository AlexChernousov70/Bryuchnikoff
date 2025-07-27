from django.contrib import admin
from django.urls import path
from catalog.views import CategoryDetailView, LeadCreateView


urlpatterns = [
    path('order_call/', LeadCreateView.as_view(), name='order_call'),
    path('<slug:slug>/', CategoryDetailView.as_view(), name='category_detail'),
]