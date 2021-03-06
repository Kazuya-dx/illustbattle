socket.on('lock_canvas', () => {
    $('.canvas').css('pointer-events','none');
});

socket.on('unlock_canvas', () => {
    $('.canvas').css('pointer-events','auto');
});

socket.on('theme_to_drawer', (data) => {
    if (data.drawer.id === socket.id) {
        $('.chat').append('<div>お題は '+data.theme+' です。</div>');
        $('.chat').animate({ scrollTop: $('.chat')[0].scrollHeight }, 'fast');
    }
});

socket.on('game_msg', (msg) => {
    $('.chat').append(msg);
    $('.chat').animate({ scrollTop: $('.chat')[0].scrollHeight }, 'fast');
});

socket.on('next_turn_to_client', () => {
    socket.emit('next_turn_to_server', {});
    socket.emit('set_waiting_to_server', 0);
});

socket.on('set_waiting_to_client', (data) => {
    socket.emit('set_waiting_to_server', data);
});

// カウントダウン処理
socket.on('count_down', (stop) => {
    let count = 60;
    $('.timer').text('');
    let id = setInterval( () => {
        $('.timer').text(count);
        if (count <= 0) {
            clearInterval(id);
            $('.timer').text('TIME UP');
            socket.emit('time_up', {});
        }
        count--;
    }, 1000);
    socket.on('count_down_stop', () => {
        clearInterval(id);
        $('.timer').text('');
    });
    
});

// ゲーム終了時の処理
socket.on('game_over_to_client', () => {
    socket.emit('game_over_to_server', {});
});

socket.on('game_over', () => {
    setTimeout( () => {
        window.location.href = 'http://127.0.0.1:3000/';
    });
});