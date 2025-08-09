from django.contrib import admin
from django.urls import path, include
# для работы с изображениями при разработке
from django.conf import settings
from django.conf.urls.static import static
from catalog.views import LandingPageView


urlpatterns = [
    path('admin/', admin.site.urls),
    path("", LandingPageView.as_view(), name="landing"),
    path('catalog/', include('catalog.urls', namespace='catalog')),
]

# для работы с изображениями при разработке
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)