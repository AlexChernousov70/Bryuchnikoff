from django.shortcuts import render
from django.views.generic import TemplateView, ListView, DetailView, CreateView
from django.views import View
from .models import Category, Lead
from .forms import LeadForm
from django.contrib import messages
from django.urls import reverse_lazy, reverse
from django.http import JsonResponse


class LandingPageView(TemplateView):
    """
    Классовое представление главной страницы, с возможностью открыть форму в модальном окне и просмотром категорий товаров в каталоге, подгружаемую из БД
    """
    template_name = 'landing.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["categories"] = Category.objects.all()
        context["form"] = LeadForm()
        return context
    
class CategoryDetailView(DetailView):
    model = Category
    template_name = 'category_detail.html'
    context_object_name = 'category'
    slug_url_kwarg = 'slug'

class LeadCreateView(CreateView):
    """
    Классовое представление, позволяющее создавать лидов - тех, кто заинтересовался продуктам и сделал заказ звонка (обратную связь)
    """
    model = Lead
    form_class = LeadForm
    template_name = 'catalog/order_call.html'

    def form_valid(self, form):
        """
        если форма валидна сохраняем объект в БД, возвращаем сообщение об успехе через AJAX
        """
        self.object = form.save()
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'message': 'Ваша заявка принята! Мы скоро с вами свяжемся.'
            })
        messages.success(self.request, 'Ваша заявка принята! Мы скоро с вами свяжемся.')
        return super().form_valid(form)

    def form_invalid(self, form):
        """
        если форма не валидна возвращаем сообщение об ошибке
        """
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'errors': form.errors
            }, status=400)
        return super().form_invalid(form)