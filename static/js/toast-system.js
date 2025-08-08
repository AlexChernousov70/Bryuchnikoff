(function() {
    'use strict';

    if (typeof bootstrap === 'undefined') {
        console.error('Toast: Bootstrap не загружен!');
        return;
    }

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

    const TOAST_CONFIG = {
        success: {
            icon: 'bi-check-circle-fill',
            bgClass: 'bg-success',
            title: 'Успех', // Русский текст
            delay: 4000
        },
        error: {
            icon: 'bi-exclamation-triangle-fill',
            bgClass: 'bg-danger',
            title: 'Ошибка', // Русский текст
            delay: 6000
        }
    };

    window.showToast = function(message, type = 'success') {
        const container = initToastContainer();
        const config = TOAST_CONFIG[type] || TOAST_CONFIG.success;

        const toastHTML = `
        <div class="toast show align-items-center text-white ${config.bgClass} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi ${config.icon} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>`;

        container.insertAdjacentHTML('afterbegin', toastHTML);
        const toastElement = container.querySelector('.toast:first-child');
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: config.delay
        });

        toast.show();
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    };

    document.addEventListener('DOMContentLoaded', initToastContainer);
})();