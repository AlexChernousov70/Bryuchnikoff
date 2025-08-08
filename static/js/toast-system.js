(function() {
    // Проверка загрузки Bootstrap
    if (typeof bootstrap === 'undefined') {
        console.error('Toast: Bootstrap не загружен!');
        return;
    }

    // Создаем контейнер для toast-уведомлений
    let toastContainer = document.getElementById('toastContainer');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1100;
            max-width: 350px;
            width: 100%;
        `;
        document.body.appendChild(toastContainer);
    }

    // Функция показа уведомлений
    window.showToast = function(message, type = 'success') {
        const colors = {
            success: 'bg-success',
            error: 'bg-danger',
            warning: 'bg-warning text-dark'
        };
        
        const toastId = 'toast-' + Date.now();
        const toastHTML = `
        <div id="${toastId}" class="toast show align-items-center text-white ${colors[type]} border-0 mb-2" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>`;
        
        toastContainer.insertAdjacentHTML('afterbegin', toastHTML);
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            const toast = document.getElementById(toastId);
            if (toast) {
                const bsToast = new bootstrap.Toast(toast);
                bsToast.hide();
                toast.addEventListener('hidden.bs.toast', () => toast.remove());
            }
        }, 5000);
    };

    // Обработчик закрытия по клику
    toastContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-close')) {
            const toast = e.target.closest('.toast');
            if (toast) {
                const bsToast = new bootstrap.Toast(toast);
                bsToast.hide();
            }
        }
    });
})();