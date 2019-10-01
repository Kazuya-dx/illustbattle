const Battle =require('./Battle.js');

module.exports = class Game {
    start(io) {
        // グローバル変数
        let iTimeLast = Date.now();

        // 接続時の処理
        io.on('connection', (socket) => {
            let room = '';
            let client = {id: '', name: ''};
            let game_flag = 0;

            console.log('connection: socket.id = %s', socket.id);
            // ゲーム開始の処理
            socket.on('enter_the_game', () => {
                console.log('enter_the_game: socket.id = %s', socket.id);
                const players = io.sockets.adapter.rooms[room].clients;

                // バトルクラスの作成
                if (typeof io.sockets.adapter.rooms[room].battle === 'undefined') {
                    io.sockets.adapter.rooms[room].battle = new Battle(players, room);
                    io.sockets.adapter.rooms[room].battle.getTheme();
                }

                io.sockets.adapter.rooms[room].battle.start(io, socket);
                console.log(io.sockets.adapter.rooms[room]);

                game_flag = 1;
            });

            // 入室時の処理
            socket.on('join_user', (data) => {
                room = data.room;
                client.name = data.name;
                client.id = socket.id;
                socket.join(room);
                io.to(room).emit('connected_msg', {msg: client.name + 'さん が Room'+ room +' に入室しました。'});
                console.log('%s が Room%s に入室しました', client.name, room);

                if (io.sockets.adapter.rooms[room].length === 1) {
                    // 1つの部屋のクライアント情報を追加
                    io.sockets.adapter.rooms[room].clients = [];
                    io.sockets.adapter.rooms[room].clients.push(client);

                    console.log(io.sockets.adapter.rooms[room]);
                }
                else {
                    io.sockets.adapter.rooms[room].clients.push(client);
                    console.log(io.sockets.adapter.rooms[room]);
                }

                // 部屋の人数が3人になった時、ゲームスタート
                if (io.sockets.adapter.rooms[room].length === 3) {
                    console.log('GAME START');
                    io.to(room).emit('enter_the_game', {});
                    io.to(room).emit('clear_msg', {});
                    io.to(room).emit('connected_msg', {msg: '<br><font size="4"><b>GAME START</b></font>'});
                }
            });

            // 切断時の処理
            socket.on('disconnect', () => {
                console.log('disconnect: socket.id = %s', socket.id);
                console.log('room: %s', room);
                if (client.name != '') {
                    console.log('%s が Room%s を退室しました', client.name, room);
                    io.to(room).emit('connected_msg', {msg: client.name + 'さん が Room'+ room +' を退室しました。'});
                    socket.leave(room);

                    if (typeof io.sockets.adapter.rooms[room] === "undefined") {}
                    else {
                        let idx = io.sockets.adapter.rooms[room].clients.indexOf(client);
                        if (idx >= 0) {
                            io.sockets.adapter.rooms[room].clients.splice(idx, 1);
                        }
                    }
                }

                if (game_flag === 1) {
                    console.log('接続が切断されました。トップ画面に戻ります。');
                    io.to(room).emit('refresh', {});
                    game_flag = 0;
                }
            });

            // メッセージの処理
            socket.on('msg_to_server', (msg) => {
                io.to(room).emit('msg_to_client', {msg: msg, name: client.name});
                console.log('%s: %s', client.name, msg);
            });
        });
    }
};