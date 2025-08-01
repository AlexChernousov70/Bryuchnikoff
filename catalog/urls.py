from django.contrib import admin
from django.urls import path
from catalog.views import OrderCallBackCreateView, ProductListView, ProductListDetail


urlpatterns = [
    path('order_call/', OrderCallBackCreateView.as_view(), name='order_call'),
    path('<slug:slug>/', ProductListView.as_view(), name='product_list'),
    path('<slug:slug>/<int:product_id>/', ProductListDetail.as_view(), name='product_detail'),
]