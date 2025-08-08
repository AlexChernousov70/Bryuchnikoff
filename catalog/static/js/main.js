// Подключение всех модулей
document.addEventListener('DOMContentLoaded', function() {
    // Проверка необходимых зависимостей
    if (typeof $ === 'undefined' || typeof bootstrap === 'undefined') {
        console.error('jQuery или Bootstrap не загружены');
        return;
    }
    
    // Инициализация всех систем
    try {
        // Модули автоматически инициализируются через свои IIFE
        console.log('Система заказов инициализирована');
    } catch (e) {
        console.error('Ошибка инициализации:', e);
    }
});