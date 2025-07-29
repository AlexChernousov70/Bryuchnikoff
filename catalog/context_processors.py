from django.conf import settings


def recaptcha_key(request):
    return {
        'RECAPTCHA_PUBLIC_KEY': settings.RECAPTCHA_PUBLIC_KEY,
        'RECAPTCHA_ENABLED': bool(
            getattr(settings, 'RECAPTCHA_PUBLIC_KEY', None) and
            getattr(settings, 'RECAPTCHA_PRIVATE_KEY', None)
        ),
    }