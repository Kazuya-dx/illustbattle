module.exports = class Game {
    start(io) {
        // グローバル変数
        let iTimeLast = Date.now();

        // 接続時の処理
        io.on('connection', (socket) => {
            let room = '';
            let name = '';

            console.log('connection: socket.id = %s', socket.id);
            // ゲーム開始の処理
            socket.on('enter_the_game', (socket) => {
                console.log('enter_the_game: socket.id = %s', socket.id);
            });

            // 入室時の処理
            socket.on('join_user', (data) => {
                room = data.room;
                name = data.name;
                socket.join(room);
                console.log('%s が Room%s に入室しました', name, room);
            });

            // 切断時の処理
            socket.on('disconnect', () => {
                console.log('disconnect: socket.id = %s', socket.id);
                if (name != '') {
                    console.log('%s が Room%s を退室しました', name, room);
                }
            });

            // メッセージの処理
            socket.on('msg_to_server', (msg) => {
                io.to(room).emit('msg_to_client', {msg: msg, name: name});
                console.log('%s: %s', name, msg);
            });

        });
    }
};