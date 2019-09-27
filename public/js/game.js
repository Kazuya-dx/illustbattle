socket.on('theme_to_drawer', (data) => {
    if (data.drawer.id === socket.id) {
        $('.line').append('お題は '+data.theme+' です。');
        $('.line').animate({ scrollTop: $('.line')[0].scrollHeight }, 'fast');
    }
});