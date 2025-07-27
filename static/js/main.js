document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderCallForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация
            const phoneInput = this.querySelector('#id_phone');
            if (!phoneInput.value.trim()) {
                alert('Пожалуйста, заполните телефон');
                phoneInput.focus();
                return;
            }
            
            // Индикатор загрузки
            const submitBtn = this.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Отправка...';
            
            // AJAX-отправка
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': this.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Закрытие модального окна через jQuery
                    $('#orderCallModal').modal('hide');
                    
                    // Очистка формы
                    this.reset();
                    
                    // Уведомление об успехе
                    alert('Спасибо! Мы скоро с вами свяжемся.');
                } else {
                    // Показ ошибок валидации
                    if (data.errors) {
                        let errorText = '';
                        for (const field in data.errors) {
                            errorText += data.errors[field].join('\n') + '\n';
                        }
                        alert('Ошибки:\n' + errorText);
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при отправке формы');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить';
            });
        });
    }
});