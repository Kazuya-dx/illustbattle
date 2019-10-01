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
})