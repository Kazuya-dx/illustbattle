module.exports = class Game {
    start(io) {
        // グローバル変数
        let iTimeLast = Date.now();

        // 接続時の処理
        io.on('connection', (socket) => {
            console.log('connection: socket.id = %s', socket.id);
            // ゲーム開始の処理
            socket.on('enter_the_game', (socket) => {
                console.log('enter_the_game: socket.id = %s', socket.id);
            });

            // 切断時の処理
            socket.on('disconnect', () => {
                console.log('disconnect: socket.id = %s', socket.id);
            });

        });
    }
};