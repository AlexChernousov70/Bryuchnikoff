from django.contrib import admin
from django.urls import path
from catalog.views import LeadCreateView, CategoryListView, ProductListView


urlpatterns = [
    path('order_call/', LeadCreateView.as_view(), name='order_call'),
    path('<slug:slug>/', CategoryListView.as_view(), name='category_list'),
    path('products/<slug:slug>/', ProductListView.as_view(), name='product_list'),
]