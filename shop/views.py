from django.shortcuts import render
from django.views.generic import TemplateView, ListView, DetailView, CreateView
from django.views import View


class LandingPageView(TemplateView):
    template_name = 'landing.html'