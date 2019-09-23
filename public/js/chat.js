'use strict';  // 厳格モードとする

function message() {
    if ($('#msgForm').val() != '') {
        let message = $('#msgForm').val();
        console.log(message);
        $('#msgForm').val('');
    }
}

$('#msgForm').keypress(function (e) {
    if (e.which == 13 && $('#msgForm').val() != '') {
        message();
        return false;
    }
});