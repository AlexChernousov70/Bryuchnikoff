document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const spinner = submitButton.querySelector('.spinner-border');
        
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
                showToast(data.message, 'success');
                form.reset();
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
                if (modal) modal.hide();
                
                if (data.review) {
                    const reviewsList = document.getElementById('reviewsList');
                    if (reviewsList) {
                        const newReview = document.createElement('div');
                        newReview.className = 'review-item mb-3 p-3 border rounded';
                        newReview.innerHTML = `
                            <div class="fw-bold">${data.review.name}</div>
                            <div class="text-muted small">${new Date(data.review.date).toLocaleString()}</div>
                            <div class="mt-2">${data.review.text}</div>
                        `;
                        reviewsList.prepend(newReview);
                    }
                }
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
            submitButton.disabled = false;
            spinner.classList.add('d-none');
        });
    });

    function handleFormErrors(form, errors) {
        form.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        form.querySelectorAll('.invalid-feedback').forEach(el => {
            el.textContent = '';
        });

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