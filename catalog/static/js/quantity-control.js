(function($) {
    'use strict';

    function initQuantityControls() {
        $(document)
            .on('click', '.plus-btn', increaseQuantity)
            .on('click', '.minus-btn', decreaseQuantity);
    }

    function increaseQuantity() {
        const $input = $(this).siblings('.quantity-input');
        const step = parseInt($input.attr('step')) || 1;
        $input.val(parseInt($input.val()) + step);
    }

    function decreaseQuantity() {
        const $input = $(this).siblings('.quantity-input');
        const value = parseInt($input.val());
        const step = parseInt($input.attr('step')) || 1;
        
        if (value > step) {
            $input.val(value - step);
        }
    }

    $(document).ready(initQuantityControls);
})(jQuery);