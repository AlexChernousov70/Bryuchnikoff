from django.contrib import admin
from django.urls import path, include
from django.conf import settings # для работы с изображениями при разработке
from django.conf.urls.static import static # для работы с изображениями при разработке
from catalog.views import LandingPageView


urlpatterns = [
    path('admin/', admin.site.urls),
    path("", LandingPageView.as_view(), name="landing"),
    # Подключаем маршруты из приложения catalog
    path('catalog/', include('catalog.urls', namespace='catalog')),
]

# для работы с изображениями при разработке
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
#     import debug_toolbar
#     urlpatterns = [
#         path('__debug__/', include(debug_toolbar.urls)),
#     ] + urlpatterns