document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const spinner = submitButton.querySelector('.spinner-border');
        
        // Показываем индикатор загрузки
        submitButton.disabled = true;
        spinner.classList.remove('d-none');

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Показываем toast-уведомление
                showToast(data.message, 'success');
                
                // Закрываем модальное окно
                const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
                if (modal) modal.hide();
                
                // Очищаем форму
                form.reset();
                
                // Можно обновить список отзывов
                location.reload(); // или добавить отзыв динамически
            } else {
                showToast('Пожалуйста, исправьте ошибки в форме', 'error');
                handleFormErrors(form, data.errors);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Произошла ошибка при отправке отзыва', 'error');
        })
        .finally(() => {
            // Восстанавливаем кнопку
            submitButton.disabled = false;
            spinner.classList.add('d-none');
        });
    });

    function handleFormErrors(form, errors) {
        // Сбрасываем предыдущие ошибки
        form.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        form.querySelectorAll('.invalid-feedback').forEach(el => {
            el.textContent = '';
        });

        // Показываем новые ошибки
        for (const field in errors) {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('is-invalid');
                const feedback = input.closest('.mb-3')?.querySelector('.invalid-feedback');
                if (feedback) {
                    feedback.textContent = errors[field].map(e => e.message).join(' ');
                }
            }
        }
    }
});