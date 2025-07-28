from django.shortcuts import render
from django.views.generic import TemplateView, ListView, DetailView, CreateView
from django.views import View
from .models import Lead, Category, Product
from .forms import LeadForm
from django.contrib import messages
from django.urls import reverse_lazy, reverse
from django.http import JsonResponse
from django.conf import settings


class LandingPageView(TemplateView):
    """
    Классовое представление главной страницы, с возможностью открыть форму в модальном окне и просмотром категорий товаров в каталоге, подгружаемую из БД
    """
    template_name = 'landing.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["categories"] = Category.objects.all()
        context["form"] = LeadForm()
        context['RECAPTCHA_PUBLIC_KEY'] = settings.RECAPTCHA_PUBLIC_KEY
        return context

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
        # Проверка reCAPTCHA
        captcha_response = self.request.POST.get('g-recaptcha-response')
        if not captcha_response:
            if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'errors': {'captcha': ['Пожалуйста, пройдите проверку reCAPTCHA']}
                }, status=400)
            form.add_error(None, 'Пожалуйста, пройдите проверку reCAPTCHA')
            return self.form_invalid(form)
        
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

class ProductListView(ListView):
    model = Product
    template_name = 'catalog/product_list.html'
    context_object_name = 'products'
    slug_url_kwarg = 'slug'  # Параметр из URL
    
    def get_queryset(self):
        # Получаем категорию по slug
        category = Category.objects.get(slug=self.kwargs['slug'])
        # Возвращаем товары этой категории
        return Product.objects.filter(category=category).select_related('category')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Добавляем категорию в контекст
        context['category'] = Category.objects.get(slug=self.kwargs['slug'])
        return context