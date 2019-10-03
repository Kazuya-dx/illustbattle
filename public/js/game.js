socket.on('theme_to_drawer', (data) => {
    if (data.drawer.id === socket.id) {
        $('.line').append('<div>お題は '+data.theme+' です。</div>');
        $('.line').animate({ scrollTop: $('.line')[0].scrollHeight }, 'fast');
    }
});

socket.on('game_msg', (msg) => {
    $('.line').append(msg);
    $('.line').animate({ scrollTop: $('.line')[0].scrollHeight }, 'fast');
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
    let id = setInterval( () => {
        count--;
        $('.timer').text(count);
        if (count <= 0) {
            clearInterval(id);
            socket.emit('time_up', {});
        }
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