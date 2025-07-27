from django.shortcuts import render
from django.views.generic import TemplateView, ListView, DetailView, CreateView
from django.views import View
from .models import Category


class LandingPageView(TemplateView):
    template_name = 'landing.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["categories"] = Category.objects.all()
        return context
    
class CategoryDetailView(DetailView):
    model = Category
    template_name = 'category_detail.html'
    context_object_name = 'category'
    slug_url_kwarg = 'slug'