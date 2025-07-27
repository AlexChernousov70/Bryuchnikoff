from django.contrib import admin
from django.urls import path
from catalog.views import CategoryDetailView


urlpatterns = [
    path('category/<slug:slug>/', CategoryDetailView.as_view(), name='category_detail'),
]