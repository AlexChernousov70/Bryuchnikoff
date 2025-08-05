from django.db import models
from django.urls import reverse


class Category(models.Model):
    """
    Категория товара
    """
    name = models.CharField(max_length=100, verbose_name="Название")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="URL")
    image = models.ImageField(upload_to='categories/', blank=True, verbose_name="Изображение")
    description = models.TextField(blank=True, verbose_name="Описание")
    
    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
class Product(models.Model):
    UNIT_CHOICES = [
        ('шт', 'Штуки'),
        ('к-т', 'Комплекты'),
        ('упак', 'Упаковки'),
        ('метр', 'Метры'),
        ('кг', 'Килограммы'),
    ]
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products', verbose_name="Категория") # при удалени категории, товару присваивается категория NULL
    name = models.CharField(max_length=200, verbose_name="Название")
    article = models.CharField(max_length=10, default="", unique=True, verbose_name="Артикул")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    description = models.TextField(blank=True, verbose_name="Описание")
    image = models.ImageField(upload_to='products/', verbose_name="Основное изображение")
    in_stock = models.BooleanField(default=True, verbose_name="В наличии")

    unit = models.CharField(
        max_length=10,
        choices=UNIT_CHOICES,
        default='шт',
        verbose_name="Единица измерения"
    )
    bulk_only = models.BooleanField(default=False, verbose_name="Только оптом (упаковкой по X штук)")
    bulk_quantity = models.PositiveIntegerField(default=1000, verbose_name="Кратность упаковки")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('product_detail', kwargs={
            'slug': self.category.slug,  # slug категории
            'product_id': self.id        # ID товара
        })
    
class Order(models.Model):
    name = models.CharField(max_length=50, verbose_name="Имя")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    email = models.EmailField(blank=True, verbose_name="Email")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Сумма заказа")
    
    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Заказ #{self.id} - {self.name} {self.phone}"
    

class Review(models.Model):
    """
    Отзывы о товаре
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', verbose_name="Товар") # при удалении товара, отзывы удаляются
    name = models.CharField(max_length=100, verbose_name="Имя")
    text = models.TextField(verbose_name="Текст отзыва")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    is_public = models.BooleanField(default=False, verbose_name="Опубликован")
    
    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Отзыв на {self.product.name} от {self.name}"
    
class OrderCallBack(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    email = models.EmailField(blank=True, verbose_name="Email")
    message = models.TextField(blank=True, verbose_name="Сообщение")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    is_processed = models.BooleanField(default=False, verbose_name="Обработан")

    def __str__(self):
        return f"{self.name} ({self.phone})"