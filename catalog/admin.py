from django.contrib import admin
from .models import Category, Product, Order, Review, OrderCallBack


# Регистрация для работы с моделями в админке
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Review)
admin.site.register(OrderCallBack)