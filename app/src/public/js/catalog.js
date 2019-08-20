$(document).ready(function() {

    $("[name='order']").on('change', function() {
        document.forms['search'].submit();
    });

});