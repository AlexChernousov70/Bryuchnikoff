(function($) {
    'use strict';

    function initOrderForm() {
        $('#orderCreateForm').on('submit', handleOrderSubmit);
    }

    function getCSRFToken() {
        return $('input[name="csrfmiddlewaretoken"]').val();
    }

    function toggleFormLoading($submitBtn, $spinner, isLoading) {
        $spinner.toggleClass('d-none', !isLoading);
        $submitBtn.prop('disabled', isLoading);
    }

    function handleSuccess(response, $form) {
        $('#orderCreateModal').modal('hide');
        showToast(response.message || 'Заказ успешно оформлен!', 'success');
        $form.trigger('reset');
    }

    function handleError(xhr) {
        let errorMsg = 'Ошибка сервера';
        
        if (xhr.responseJSON) {
            errorMsg = xhr.responseJSON.error || 
                      xhr.responseJSON.errors || 
                      errorMsg;
        }
        
        showToast(errorMsg, 'error');
    }

    function handleOrderSubmit(e) {
        e.preventDefault();
        const $form = $(this);

        // Проверка CSRF токена
        if (!getCSRFToken()) {
            showToast('Ошибка безопасности. Пожалуйста, перезагрузите страницу.', 'error');
            return;
        }

        // Проверка product_id
        const productId = $('#product_id').val();
        if (!productId) {
            showToast('Не выбран товар для заказа', 'error');
            return;
        }

        const $submitBtn = $form.find('button[type="submit"]');
        const $spinner = $submitBtn.find('.spinner-border');
        
        toggleFormLoading($submitBtn, $spinner, true);
        
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