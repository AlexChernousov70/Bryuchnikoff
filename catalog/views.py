from django.shortcuts import render
from django.views.generic import TemplateView, ListView, DetailView, CreateView
from django.views import View
from .models import OrderCallBack, Category, Product, Order
from .forms import OrderCallBackForm, OrderCreateForm
from django.contrib import messages
from django.http import JsonResponse, Http404
from django.core.exceptions import ValidationError
import json


class LandingPageView(TemplateView):
    """
    Классовое представление главной страницы, с возможностью открыть форму в модальном окне и просмотром категорий товаров в каталоге, подгружаемую из БД
    """
    template_name = 'landing.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["categories"] = Category.objects.all()
        context["form"] = OrderCallBackForm()
        return context

class OrderCallBackCreateView(CreateView):
    model = OrderCallBack
    form_class = OrderCallBackForm
    template_name = 'catalog/order_call.html'
    success_url = '/'

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
        context["categories"] = Category.objects.all()
        context['category'] = Category.objects.get(slug=self.kwargs['slug'])
        context["form"] = OrderCallBackForm()
        return context

class ProductListDetail(DetailView):
    model = Product
    template_name = 'catalog/product_detail.html'
    context_object_name = 'product'
    pk_url_kwarg = 'product_id'
    slug_url_kwarg = 'slug'

    def get_object(self, queryset=None):
        try:
            # Получаем товар по ID и проверяем, что он принадлежит указанной категории
            return Product.objects.get(
                id=self.kwargs['product_id'],
                category__slug=self.kwargs['slug']
            )
        except Product.DoesNotExist:
            raise Http404("Товар не найден")
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = self.object.category
        context['categories'] = Category.objects.all()
        return context

class OrderCreateView(CreateView):
    model = Order
    form_class = OrderCreateForm
    http_method_names = ['post']  # Разрешаем только POST

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        return self.form_invalid(form)

    def form_valid(self, form):
        try:
            product = Product.objects.get(
                id=self.request.POST.get('product_id'),
                in_stock=True
            )
            order = form.save(commit=False)
            order.product = product
            order.quantity = int(self.request.POST.get('quantity', 1))
            order.total = product.price * order.quantity
            order.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Ваш заказ успешно оформлен!'
            })
            
        except Product.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Товар не найден или отсутствует в наличии'
            }, status=400)

    def form_invalid(self, form):
        return JsonResponse({
            'success': False,
            'errors': form.errors
        }, status=400)