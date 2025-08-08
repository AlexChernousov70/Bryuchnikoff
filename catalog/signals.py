# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import OrderCallBack
from .telegram_bot import send_telegram_message
from asyncio import run
from django.conf import settings
from django.utils import timezone
import html
import logging
import re

logger = logging.getLogger(__name__)

TELEGRAM_BOT_API_KEY = settings.TELEGRAM_BOT_API_KEY
TELEGRAM_USER_ID = settings.TELEGRAM_USER_ID

@receiver(post_save, sender=OrderCallBack)
def send_lead_notification(sender, instance, created, **kwargs):
    if not created:
        return

    try:
        # конвертирую время в московское
        moscow_time = timezone.localtime(instance.created_at)
        created_at = moscow_time.strftime("%d.%m.%Y %H:%M")
        
        # Получаем чистый номер (только цифры и +)
        clean_phone = '+7' + re.sub(r'[^\d]', '', instance.phone)[1:]

        # Сохраняем оригинальное форматирование для отображения
        display_phone = instance.phone

        # Создаём HTML-ссылку
        phone_line = f'<a href="tel:{clean_phone}">{display_phone}</a>'
        print(phone_line)
        # Проверяем российский номер (11 цифр вместе с +7)
        if clean_phone.startswith('+7') and len(clean_phone) == 12:
            # Форматируем для отображения (сохраняем оригинальный формат)
            display_phone = instance.phone
            # Создаем кликабельную ссылку
            phone_line = f'<a href="tel:{clean_phone}">{display_phone}</a>'
        else:
            phone_line = f'{instance.phone} (некорректный формат)'

        message = (
    "<b>📞 Новая заявка на обратный звонок</b>\n\n"
    f"<b>Имя:</b> {html.escape(instance.name)}\n"
    f"<b>Телефон:</b> <code>{clean_phone}</code>\n"
    f"<b>Email:</b> {html.escape(instance.email) if instance.email else 'не указан'}\n"
    f"<b>Сообщение:</b> {html.escape(instance.message) if instance.message else 'не указано'}\n"
    f"<b>Дата создания:</b> {created_at}\n\n"
    "#обратный_звонок"
    )
        run(send_telegram_message(
            TELEGRAM_BOT_API_KEY,
            TELEGRAM_USER_ID,
            message,
            parse_mode="HTML"
        ))

    except Exception as e:
        logger.error(f"Ошибка при отправке: {e}", exc_info=True)