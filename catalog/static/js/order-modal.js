(function($) {
    'use strict';

    function initOrderModal() {
        $('#orderCreateModal').on('show.bs.modal', function(event) {
            const button = $(event.relatedTarget);
            
            // Получаем product_id из data-атрибута кнопки
            const productId = button.data('product-id');
            
            // Находим родительскую карточку товара
            const productCard = button.closest('.product-card');
            
            if (!productCard.length) {
                console.error('Карточка товара не найдена');
                return;
            }

            // Получаем данные из инпута количества
            const quantityInput = productCard.find('.quantity-input');
            
            // Получаем цену с сохранением копеек
            const priceStr = quantityInput.data('price').toString().replace(',', '.');
            const price = parseFloat(priceStr);
            
            if (isNaN(price)) {
                console.error('Цена должна быть числом:', quantityInput.data('price'));
                return;
            }
            
            // Получаем название товара
            const productName = productCard.find('.card-title').text().trim();
            
            // Получаем единицы измерения
            const priceText = productCard.find('.h4').text();
            const unit = priceText.split('/')[1]?.trim() || 'шт';
            
            // Получаем количество
            const quantity = parseInt(quantityInput.val()) || 1;

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
        // Форматируем с двумя знаками после запятой
        const formattedUnitPrice = product.unitPrice.toFixed(2);
        const total = (product.unitPrice * product.quantity).toFixed(2);
        
        // Устанавливаем значения в скрытые поля - ОБРАТИТЕ ВНИМАНИЕ НА ЭТИ СТРОКИ
        $('#orderCreateModal #product_id').val(product.id); // Явно указываем модальное окно
        $('#orderCreateModal #quantity').val(product.quantity);
        
        // Обновляем отображаемую информацию
        $('#order-product-name').text(product.name);
        $('#order-quantity').text(`${product.quantity} ${product.unit}`);
        $('#order-unit-price').text(`${formattedUnitPrice} ₽/${product.unit}`);
        $('#order-total').text(`${total} ₽`);
    }

    $(document).ready(initOrderModal);
})(jQuery);