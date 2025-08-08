(function() {
    'use strict';

    // Проверка загрузки Bootstrap
    if (typeof bootstrap === 'undefined') {
        console.error('Toast: Bootstrap не загружен!');
        return;
    }

    // Создаем контейнер для toast-уведомлений
    const initToastContainer = () => {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.cssText = 'z-index: 1100; max-width: 350px;';
            document.body.appendChild(container);
        }
        return container;
    };

    // Конфигурация стилей для уведомлений
    const TOAST_CONFIG = {
        success: {
            icon: 'bi-check-circle-fill',
            bgClass: 'bg-success',
            title: 'Успешно',
            delay: 4000
        },
        error: {
            icon: 'bi-exclamation-triangle-fill',
            bgClass: 'bg-danger',
            title: 'Ошибка',
            delay: 6000
        },
        warning: {
            icon: 'bi-exclamation-circle-fill',
            bgClass: 'bg-warning text-dark',
            title: 'Внимание',
            delay: 5000
        }
    };

    // Единая функция показа уведомлений
    window.showToast = function(message, type = 'success') {
        const container = initToastContainer();
        const config = TOAST_CONFIG[type] || TOAST_CONFIG.success;

        const toastId = 'toast-' + Date.now();
        const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${config.bgClass} text-white border-0">
                <i class="bi ${config.icon} me-2"></i>
                <strong class="me-auto">${config.title}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>`;

        container.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: config.delay
        });

        toast.show();
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    };

    // Инициализация при загрузке
    document.addEventListener('DOMContentLoaded', initToastContainer);
})();