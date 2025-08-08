(function($) {
    'use strict';

    window.showAlert = function(type, message) {
        const $container = $('.container').first();
        const alertId = 'alert-' + Date.now();
        
        const $alert = $(`
            <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $container.prepend($alert);
        
        setTimeout(() => {
            $alert.alert('close');
        }, 5000);
        
        $alert.on('closed.bs.alert', function() {
            $(this).remove();
        });
    };
})(jQuery);