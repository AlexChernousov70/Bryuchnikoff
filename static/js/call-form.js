(function($) {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const $orderCallForm = $('#orderCallForm');
        
        if (!$orderCallForm.length) return;

        $orderCallForm.on('submit', function(e) {
            e.preventDefault();
            
            const $form = $(this);
            const $submitBtn = $form.find('[type="submit"]');
            const originalBtnText = $submitBtn.html();
            
            // Индикатор загрузки
            $submitBtn.prop('disabled', true);
            $submitBtn.html(`
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Отправка...
            `);

            // Проверка reCAPTCHA
            if (typeof grecaptcha === 'undefined' || !grecaptcha.getResponse()) {
                showToast('Пожалуйста, подтвердите, что вы не робот', 'error');
                resetSubmitButton($submitBtn, originalBtnText);
                return;
            }

            // AJAX-отправка
            sendFormRequest($form, $submitBtn, originalBtnText);
        });

        function resetSubmitButton($btn, originalHtml) {
            $btn.prop('disabled', false);
            $btn.html(originalHtml);
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
        }

        function sendFormRequest($form, $submitBtn, originalBtnText) {
            $.ajax({
                url: $form.attr('action'),
                type: 'POST',
                data: $form.serialize(),
                headers: {
                    'X-CSRFToken': $form.find('[name=csrfmiddlewaretoken]').val()
                },
                success: function(data) {
                    handleSuccessResponse(data, $form);
                },
                error: function(xhr) {
                    handleErrorResponse(xhr);
                },
                complete: function() {
                    resetSubmitButton($submitBtn, originalBtnText);
                }
            });
        }

        function handleSuccessResponse(data, $form) {
            if (data.success) {
                showToast(data.message || 'Ваша заявка принята! Мы скоро с вами свяжемся.');
                $('#orderCallModal').modal('hide');
                $form[0].reset();
            } else {
                const errorText = data.errors ? 
                    Object.entries(data.errors)
                        .map(([field, errors]) => Array.isArray(errors) ? errors.join(' ') : errors)
                        .join('\n') 
                    : 'Неизвестная ошибка';
                showToast(errorText, 'error');
            }
        }

        function handleErrorResponse(xhr) {
            let errorMessage = 'Ошибка соединения с сервером';
            
            if (xhr.responseJSON) {
                errorMessage = xhr.responseJSON.error || 
                            xhr.responseJSON.message || 
                            JSON.stringify(xhr.responseJSON);
            } else if (xhr.statusText) {
                errorMessage = xhr.statusText;
            }
            
            showToast(errorMessage, 'error');
        }
    });
})(jQuery);