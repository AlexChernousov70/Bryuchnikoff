(function($) {
    'use strict';

    function initOrderModal() {
        $('#orderCreateModal').on('show.bs.modal', function(event) {
            const button = $(event.relatedTarget);
            const productCard = button.closest('.product-card');
            
            if (!productCard.length) {
                console.error('Product card not found');
                return;
            }

            const productData = getProductData(productCard);
            updateOrderForm(productData);
        });
    }

    function getProductData(productCard) {
        const priceText = productCard.find('.h4').text();
        const priceMatch = priceText.match(/([\d.]+)/);
        const unitParts = priceText.split('/');
        
        return {
            id: productCard.data('product-id'),
            name: productCard.find('.card-title').text().trim() || 'Товар',
            quantity: parseInt(productCard.find('.quantity-input').val()) || 1,
            unitPrice: priceMatch ? parseFloat(priceMatch[0]) : 0,
            unit: unitParts.length > 1 ? unitParts[1].trim() : 'шт'
        };
    }

    function updateOrderForm(product) {
        const total = (product.unitPrice * product.quantity).toFixed(2);
        
        $('#product_id').val(product.id);
        $('#quantity').val(product.quantity);
        
        $('#order-product-name').text(product.name);
        $('#order-quantity').text(`${product.quantity} ${product.unit}`);
        $('#order-unit-price').text(`${product.unitPrice} ₽/${product.unit}`);
        $('#order-total').text(`${total} ₽`);
    }

    $(document).ready(initOrderModal);
})(jQuery);