// В обработчике формы
$('#orderCreateForm').submit(function(e) {
    e.preventDefault();
    const form = $(this);
    const submitBtn = form.find('button[type="submit"]');
    const spinner = submitBtn.find('.spinner-border');
    
    spinner.removeClass('d-none');
    submitBtn.prop('disabled', true);
    
    // Собираем данные формы
    const formData = {
        first_name: $('#orderFirstName').val(),
        phone: $('#orderPhone').val(),
        email: $('#orderEmail').val(),
        product_id: $('#product_id').val(),
        quantity: $('#quantity').val()
    };
    
    $.ajax({
        type: "POST",
        url: form.attr('action'),
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            $('#orderCreateModal').modal('hide');
            showSuccessAlert(response.message || 'Ваш заказ успешно оформлен!');
            form.trigger("reset");
        },
        error: function(xhr) {
            const error = xhr.responseJSON?.error || 'Произошла ошибка';
            showErrorAlert(error);
        },
        complete: function() {
            spinner.addClass('d-none');
            submitBtn.prop('disabled', false);
        }
    });
});