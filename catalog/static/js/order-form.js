(function($) {
    'use strict';

    function initOrderForm() {
        $('#orderCreateForm').on('submit', handleOrderSubmit);
    }

    function getCSRFToken() {
        const token = $('input[name="csrfmiddlewaretoken"]').val();
        console.log('CSRF Token:', token); // Добавьте лог
        return token;
    }

    function toggleFormLoading($submitBtn, $spinner, isLoading) {
        $spinner.toggleClass('d-none', !isLoading);
        $submitBtn.prop('disabled', isLoading);
    }

    function handleSuccess(response, $form) {
        $('#orderCreateModal').modal('hide');
        showAlert('success', response.message || 'Заказ успешно оформлен!');
        $form.trigger('reset');
    }

    function handleError(xhr) {
        const errorMsg = xhr.responseJSON?.error || 
                    xhr.responseJSON?.errors || 
                    'Ошибка сервера';
        showAlert('danger', errorMsg);
    }

    function handleOrderSubmit(e) {
        e.preventDefault();
        const $form = $(this);
        console.log('Form data:', $(this).serialize());

        // 1. Проверка CSRF токена
        if (!getCSRFToken()) {
            showAlert('danger', 'Ошибка безопасности. Пожалуйста, перезагрузите страницу.');
            return;
        }

        // 2. Проверка product_id перед отправкой
        const productId = $('#product_id').val();
        console.log('Отправляемый product_id:', productId); // Для отладки
        
        if (!productId) {
            showAlert('danger', 'Не выбран товар для заказа');
            return;
        }

        const $submitBtn = $form.find('button[type="submit"]');
        const $spinner = $submitBtn.find('.spinner-border');
        
        toggleFormLoading($submitBtn, $spinner, true);
        
        // 3. Отправка данных
        $.ajax({
            type: "POST",
            url: $form.attr('action'),
            data: $form.serialize(),
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function(response) {
                handleSuccess(response, $form);
            },
            error: handleError,
            complete: function() {
                toggleFormLoading($submitBtn, $spinner, false);
            }
        });
    }

    $(document).ready(initOrderForm);
})(jQuery);