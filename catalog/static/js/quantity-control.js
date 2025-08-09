(function($) {
    'use strict';

    function initQuantityControls() {
        $(document)
            .on('click', '.plus-btn', increaseQuantity)
            .on('click', '.minus-btn', decreaseQuantity)
            .on('input change', '.quantity-input', validateQuantity);
    }

    function getInputSettings($input) {
        return {
            step: parseInt($input.attr('step')) || 1,
            min: parseInt($input.attr('min')) || 1,
            value: parseInt($input.val()) || parseInt($input.attr('min')) || 1
        };
    }

    function increaseQuantity() {
        const $input = $(this).siblings('.quantity-input');
        const {step, min, value} = getInputSettings($input);
        let newValue = value + step;
        
        // Для bulk_only округляем вверх до шага
        if (step > 1) {
            newValue = Math.ceil(newValue / step) * step;
        }
        
        $input.val(newValue).trigger('change');
    }

    function decreaseQuantity() {
        const $input = $(this).siblings('.quantity-input');
        const {step, min, value} = getInputSettings($input);
        
        if (value > min) {
            let newValue = value - step;
            // Не позволяем уйти ниже минимального
            if (newValue < min) newValue = min;
            // Для bulk_only округляем вниз до шага
            if (step > 1 && newValue % step !== 0) {
                newValue = Math.floor(newValue / step) * step;
                if (newValue < min) newValue = min;
            }
            $input.val(newValue).trigger('change');
        }
    }

    function validateQuantity() {
        const $input = $(this);
        const {step, min} = getInputSettings($input);
        let value = parseInt($input.val()) || min;
        
        // Базовые проверки
        if (isNaN(value)) value = min;
        if (value < min) value = min;
        
        // Для bulk_only проверяем кратность
        if (step > 1) {
            value = Math.round(value / step) * step;
            if (value < min) value = min;
        }
        
        $input.val(value);
    }

    $(document).ready(initQuantityControls);
})(jQuery);