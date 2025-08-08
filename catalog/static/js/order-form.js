(function($) {
    'use strict';

    function initOrderForm() {
        $('#orderCreateForm').on('submit', handleOrderSubmit);
    }

    function handleOrderSubmit(e) {
        e.preventDefault();
        const $form = $(this);
        const $submitBtn = $form.find('button[type="submit"]');
        const $spinner = $submitBtn.find('.spinner-border');
        
        toggleFormLoading($submitBtn, $spinner, true);
        
        $.ajax({
            type: "POST",
            url: $form.attr('action'),
            data: $form.serialize(),
            headers: {
                'X-CSRFToken': getCSRFToken()
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

    function getCSRFToken() {
        return $('input[name="csrfmiddlewaretoken"]').val();
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

    $(document).ready(initOrderForm);
})(jQuery);