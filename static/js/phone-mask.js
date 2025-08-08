(function($) {
    document.addEventListener('DOMContentLoaded', function() {
        if ($('#id_phone').length) {
            $('#id_phone').inputmask('+7 (999) 999-99-99');
        }
    });
})(jQuery);