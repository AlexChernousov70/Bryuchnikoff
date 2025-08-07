// Универсальные функции для работы с заказами
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация модального окна
    $('#orderCreateModal').on('show.bs.modal', function(event) {
        const button = $(event.relatedTarget);
        const productId = button.data('product-id');
        const quantity = button.closest('.product-card')?.find('.quantity-input').val() || 1;
        const productCard = button.closest('.product-card');
        
        // Получаем данные о товаре
        const productName = productCard?.find('.card-title').text() || 'Товар';
        const unitPrice = parseFloat(productCard?.find('.h4').text().match(/([\d.]+)/)[0]) || 0;
        const unit = productCard?.find('.h4').text().split('/')[1]?.trim() || 'шт';
        const total = (unitPrice * quantity).toFixed(2);
        
        // Заполняем скрытые поля
        $('#product_id').val(productId);
        $('#quantity').val(quantity);
        
        // Обновляем информацию о заказе
        $('#order-product-name').text(productName);
        $('#order-quantity').text(`${quantity} ${unit}`);
        $('#order-unit-price').text(`${unitPrice} ₽/${unit}`);
        $('#order-total').text(`${total} ₽`);
    });

    // Обработка формы
    $('#orderCreateForm').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        const spinner = submitBtn.find('.spinner-border');
        
        spinner.removeClass('d-none');
        submitBtn.prop('disabled', true);
        
        // Добавляем CSRF токен
        const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

        $.ajax({
            type: "POST",
            url: form.attr('action'),
            data: form.serialize(),
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", $('input[name="csrfmiddlewaretoken"]').val());
            },
            success: function(response) {
                $('#orderCreateModal').modal('hide');
                showAlert('success', response.message || 'Заказ успешно оформлен!');
                form.trigger("reset");
            },
            error: function(xhr) {
                let errorMsg = 'Ошибка сервера';
                if (xhr.responseJSON) {
                    errorMsg = xhr.responseJSON.error || 
                            xhr.responseJSON.errors || 
                            errorMsg;
                }
                showAlert('danger', errorMsg);
            },
            complete: function() {
                spinner.addClass('d-none');
                submitBtn.prop('disabled', false);
            }
        });
    });

    // Общие обработчики количества
    $(document).on('click', '.plus-btn', function() {
        const input = $(this).siblings('.quantity-input');
        input.val(parseInt(input.val()) + parseInt(input.attr('step')));
    });

    $(document).on('click', '.minus-btn', function() {
        const input = $(this).siblings('.quantity-input');
        const value = parseInt(input.val());
        const step = parseInt(input.attr('step'));
        if (value > step) input.val(value - step);
    });
});

// Универсальная функция уведомлений
function showAlert(type, message) {
    const alert = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    
    $('.container').first().prepend(alert);
    setTimeout(() => $('.alert').alert('close'), 5000);
}

