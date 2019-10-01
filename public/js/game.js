socket.on('theme_to_drawer', (data) => {
    if (data.drawer.id === socket.id) {
        $('.line').append('お題は '+data.theme+' です。');
        $('.line').animate({ scrollTop: $('.line')[0].scrollHeight }, 'fast');
    }
});

socket.on('game_msg', (msg) => {
    $('.line').append(msg);
    $('.line').animate({ scrollTop: $('.line')[0].scrollHeight }, 'fast');
});

socket.on('next_turn_to_client', () => {
    socket.emit('next_turn_to_server', {});
});

// ゲーム終了時の処理
socket.on('game_over_to_client', () => {
    socket.emit('game_over_to_server', {});
});

socket.on('game_over', () => {
    setTimeout( () => {
        window.location.href = 'http://127.0.0.1:3000/result/';
    });
});