(function($) {
    'use strict';

    function initOrderModal() {
        $('#orderCreateModal').on('show.bs.modal', function(event) {
            const button = $(event.relatedTarget);
            console.log('Кнопка, вызвавшая модальное окно:', button); // Логирование
            
            // Получаем product_id из data-атрибута кнопки
            const productId = button.data('product-id');
            console.log('Product ID из кнопки:', productId);
            
            // Находим родительскую карточку товара
            const productCard = button.closest('.product-card');
            console.log('Карточка товара:', productCard);
            
            if (!productCard.length) {
                console.error('Карточка товара не найдена');
                return;
            }

            // Получаем данные из инпута количества
            const quantityInput = productCard.find('.quantity-input');
            console.log('Инпут количества:', quantityInput);
            
            // Получаем цену из data-атрибута инпута
            const price = parseFloat(quantityInput.data('price')) || 0;
            console.log('Цена товара:', price);
            
            // Получаем название товара
            const productName = productCard.find('.card-title').text().trim();
            console.log('Название товара:', productName);
            
            // Получаем единицы измерения
            const priceText = productCard.find('.h4').text();
            const unit = priceText.split('/')[1]?.trim() || 'шт';
            console.log('Единицы измерения:', unit);
            
            // Получаем количество
            const quantity = parseInt(quantityInput.val()) || 1;
            console.log('Количество:', quantity);

            // Обновляем форму
            updateOrderForm({
                id: productId,
                name: productName,
                quantity: quantity,
                unitPrice: price,
                unit: unit
            });
        });
    }

    function updateOrderForm(product) {
        console.log('Обновление формы с данными:', product);
        
        const total = (product.unitPrice * product.quantity).toFixed(2);
        
        // Устанавливаем значения в скрытые поля
        $('#product_id').val(product.id);
        $('#quantity').val(product.quantity);
        
        // Обновляем отображаемую информацию
        $('#order-product-name').text(product.name);
        $('#order-quantity').text(`${product.quantity} ${product.unit}`);
        $('#order-unit-price').text(`${product.unitPrice} ₽/${product.unit}`);
        $('#order-total').text(`${total} ₽`);
        
        console.log('Значения полей формы:', {
            product_id: $('#product_id').val(),
            quantity: $('#quantity').val()
        });
    }

    $(document).ready(initOrderModal);
})(jQuery);