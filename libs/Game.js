module.exports = class Game {
    start(io) {
        // グローバル変数
        let iTimeLast = Date.now();

        // 接続時の処理
        io.on('connection', (socket) => {
            let room = '';
            let name = '';
            let game_flag = 0;

            console.log('connection: socket.id = %s', socket.id);
            // ゲーム開始の処理
            socket.on('enter_the_game', (socket) => {
                console.log('enter_the_game: socket.id = %s', socket.id);
                game_flag = 1;
            });

            // 入室時の処理
            socket.on('join_user', (data) => {
                room = data.room;
                name = data.name;
                socket.join(room);
                io.to(room).emit('connected_msg', {msg: name + 'さん が Room'+ room +' に入室しました。'});
                console.log('%s が Room%s に入室しました', name, room);
                console.log(io.sockets.adapter.rooms[room].length);

                // 部屋の人数が3人になった時、ゲームスタート
                if (io.sockets.adapter.rooms[room].length === 3) {
                    console.log('GAME START');
                    io.to(room).emit('enter_the_game', {});
                    io.to(room).emit('connected_msg', {msg: 'GAME START'});
                }
            });

            // 切断時の処理
            socket.on('disconnect', () => {
                console.log('disconnect: socket.id = %s', socket.id);
                console.log('room: %s', room);
                if (name != '') {
                    console.log('%s が Room%s を退室しました', name, room);
                    io.to(room).emit('connected_msg', {msg: name + 'さん が Room'+ room +' を退室しました。'});
                    socket.leave(room);
                }

                if (game_flag === 1) {
                    console.log('接続が切断されました。トップ画面に戻ります。');
                    io.to(room).emit('refresh', {});
                    game_flag = 0;
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