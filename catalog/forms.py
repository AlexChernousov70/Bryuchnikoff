from django import forms
from .models import Order, OrderCallBack, Review
from django_recaptcha.fields import ReCaptchaField
from django_recaptcha.widgets import ReCaptchaV2Checkbox


class OrderCreateForm(forms.ModelForm):
    captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox)
    product_id = forms.IntegerField(widget=forms.HiddenInput())
    quantity = forms.IntegerField(widget=forms.HiddenInput())
    
    class Meta:
        model = Order
        fields = ['name', 'phone', 'email', 'product_id', 'quantity']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ваше имя'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '+7 (999) 123-45-67'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'email@example.com'}),
        }
        labels = {
            'name': 'Ваше имя',
            'phone': 'Телефон',
            'email': 'Email',
        }

class ReviewForm(forms.ModelForm):
    captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox)
    
    class Meta:
        model = Review
        fields = ['name', 'text']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ваше имя'}),
            'text': forms.Textarea(attrs={
                'class': 'form-control', 
                'placeholder': 'Ваш отзыв о товаре',
                'rows': 4
            }),
        }
        labels = {
            'name': 'Ваше имя',
            'text': 'Текст отзыва',
        }

class OrderCallBackForm(forms.ModelForm):
    captcha = ReCaptchaField(widget=ReCaptchaV2Checkbox)
    
    class Meta:
        model = OrderCallBack
        fields = ['name', 'phone', 'email', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ваше имя'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '+7 (999) 123-45-67'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'email@example.com'}),
            'message': forms.Textarea(attrs={
                'class': 'form-control', 
                'placeholder': 'Время звонка или Ваше сообщение',
                'rows': 3
            }),
        }
        labels = {
            'name': 'Ваше имя',
            'phone': 'Телефон',
            'email': 'Email',
            'message': 'Сообщение',
        }