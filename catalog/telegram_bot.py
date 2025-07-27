import os
import logging
from telegram import Bot # poetry add python-telegram-bot
import asyncio
from dotenv import load_dotenv


# загружаю переменные окружения из .env файла
load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.DEBUG)

async def send_telegram_message(token, chat_id, message, parse_mode="HTML"):
    try:
        bot = Bot(token=token)
        await bot.send_message(
            chat_id=chat_id,
            text=message,
            parse_mode="HTML",
            disable_web_page_preview=True,
            disable_notification=False
        )
        # logging.info(f'Сообщение отправлено в чат {chat_id}')
    except Exception as e:
        # logging.error(f"Ошибка отправки сообщения в чат {chat_id}: {e}")
        raise

# Тест на месте командой poetry run python catalog\telegram_bot.py
if __name__ == "__main__":
    load_dotenv()
    TELEGRAM_BOT_API_KEY = os.getenv("TELEGRAM_BOT_API_KEY")
    TELEGRAM_USER_ID = os.getenv("TELEGRAM_USER_ID")
    message = "*тестовое сообщение*"
    asyncio.run(send_telegram_message(TELEGRAM_BOT_API_KEY, TELEGRAM_USER_ID, message))