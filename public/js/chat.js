'use strict';

function message() {
    if ($('#msgForm').val() != '') {
        let message = $('#msgForm').val();
        console.log(message);
        socket.emit('msg_to_server', message);
        $('#msgForm').val('');
    }
}

$('#msgForm').keypress(function (e) {
    if (e.which == 13 && $('#msgForm').val() != '') {
        message();
        return false;
    }
});

socket.on('msg_to_client', (data) => {
    $('.line').prepend('<div>'+data.name+': '+data.msg+'</div>');
});