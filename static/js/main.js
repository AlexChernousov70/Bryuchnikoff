document.addEventListener('DOMContentLoaded', function() {
    // Создаем контейнер для toast
    const createToastContainer = () => {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '1100';
        container.style.maxWidth = '350px';
        container.style.width = '100%';
        document.body.appendChild(container);
        return container;
    };

    const toastContainer = document.getElementById('toastContainer') || createToastContainer();

    // Функция для показа toast
    const showToast = (message, type = 'success') => {
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
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    };

    // Закрытие toast по клику
    toastContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-close')) {
            const toast = e.target.closest('.toast');
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    });

    // Обработка формы
    const form = document.getElementById('orderCallForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверка reCAPTCHA
            const captchaResponse = grecaptcha.getResponse();
            if (!captchaResponse) {
                showToast('Пожалуйста, подтвердите, что вы не робот', 'error');
                return;
            }

            // Валидация обязательных полей
            const phoneInput = this.querySelector('#id_phone');
            if (!phoneInput.value.trim()) {
                showToast('Пожалуйста, заполните телефон', 'warning');
                phoneInput.focus();
                return;
            }

            // Индикатор загрузки
            const submitBtn = this.querySelector('[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Отправка...
            `;

            // Подготовка данных формы
            const formData = new FormData(this);
            formData.append('g-recaptcha-response', captchaResponse);

            // AJAX-отправка
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': this.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(errData.errors || 'Ошибка сервера');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showToast(data.message);
                    // Закрываем модальное окно через 1 секунду
                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('orderCallModal'));
                        if (modal) modal.hide();
                        this.reset();
                        grecaptcha.reset(); // Сбрасываем капчу
                    }, 1000);
                } else {
                    const errorText = data.errors ? Object.values(data.errors).flat().join('\n') : 'Неизвестная ошибка';
                    showToast(errorText, 'error');
                    grecaptcha.reset(); // Сбрасываем капчу при ошибке
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast(error.message || 'Произошла ошибка при отправке формы', 'error');
                grecaptcha.reset(); // Сбрасываем капчу при ошибке
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }
});