import html
import re
import logging

from django.db.models.signals import post_save
from django.dispatch import receiver
from .telegram_bot import send_telegram_message
from asyncio import run
from django.conf import settings
from django.utils import timezone

from .models import OrderCallBack

TELEGRAM_BOT_API_KEY = settings.TELEGRAM_BOT_API_KEY
TELEGRAM_USER_ID = settings.TELEGRAM_USER_ID

logger = logging.getLogger(__name__)

def escape_markdown(text: str) -> str:
    """Экранирует специальные символы для Telegram MarkdownV2."""
    # Список символов, которые нужно экранировать
    escape_chars = r'\_*[]()~`>#+-=|{}.!'
    # Создаем регулярное выражение для поиска этих символов
    return re.sub(f'([{re.escape(escape_chars)}])', r'\\\1', text)

@receiver(post_save, sender=OrderCallBack)
def send_lead_notification(sender, instance, created, **kwargs):
    if not created:
        return

    try:
        # 2. Обработка номера телефона (формат гарантирован маской: +7 (999) 999-49-99)
        # Удаляем все символы кроме цифр и +
        clean_phone = re.sub(r'[^\d+]', '', instance.phone)  # -> "+79999994999"
        phone_line = f'[{escape_markdown(instance.phone)}](tel:{clean_phone})'

        # 4. Сборка финального сообщения
        message = f'[{phone_line}]({clean_phone})'
        run(send_telegram_message(
            settings.TELEGRAM_BOT_API_KEY,
            settings.TELEGRAM_USER_ID,
            message,
            parse_mode="MarkdownV2"
        ))
        logger.info(f"Уведомление для заявки {instance.pk} успешно отправлено в Telegram")

    except Exception as e:
        logger.error(f"Ошибка при отправке уведомления в Telegram: {e}", exc_info=True)