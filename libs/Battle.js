// グローバル変数
const themes = [
    'スカイツリー', '東京タワー', 'イチロー', 'マリオ', '相撲', '闇遊戯',
    '織田信長', 'タピオカ', '渋谷', '宇宙', 'ボルト', 'ドラえもん',
];

module.exports = class Battle {
    constructor(clients, room) {
        this.room = room;
        this.p1 = clients[0];
        this.p2 = clients[1];
        this.p3 = clients[2];
        this.p1points = 0;
        this.p2points = 0;
        this.p3points = 0;
        this.drawer = this.p1;
        this.turn = 0;
        this.endturn = 6;
        this.waiting = 0;
        this.gametheme = [];
    }

    getTheme() {
        const tmp = [];
        while (true) {
            if (tmp.length === this.endturn) {
                this.gametheme = tmp;
                return 0;
            }
            let num = Math.floor(Math.random() * themes.length);
            if (!tmp.includes(themes[num])) {
                tmp.push(themes[num]);
            }
        };
    };

    calcPoints(io, socket) {
        if (socket.id === this.p1.id) {
            this.p1points += 100;
            if (this.drawer.id === this.p2.id) this.p2points += 100;
            else this.p3points += 100;
        }
        else if (socket.id === this.p2.id) {
            this.p2points += 100;
            if (this.drawer.id === this.p1.id) this.p1points += 100;
            else this.p3points += 100;
        }
        else {
            this.p3points += 100;
            if (this.drawer.id === this.p1.id) this.p1points += 100;
            else this.p2points += 100;
        }
        // デバッグログ
        io.to(this.room).emit('game_msg', '<div>p1points:'+this.p1points+' p2points:'+this.p2points+' p3points:'+this.p3points+'</div>');
    }

    changeDrawer() {
        if (this.drawer === this.p1) this.drawer = this.p2;
        else if (this.drawer === this.p2) this.drawer = this.p3;
        else this.drawer = this.p1;
    }

    start(io, socket) {
        if (socket.id === this.drawer.id) {
            // タイマースタート
            io.to(this.room).emit('count_down', {});
            // 現在のターン・描き手を知らせるメッセージ
            io.to(this.room).emit('game_msg', '<br><div><font color="red">----- '+(this.turn+1)+'ターン目 -----</font></div>');
            io.to(this.room).emit('game_msg', '<div>'+this.drawer.name+' が絵を描く番です。</div>');
            // 描き手のみにお題を伝えるメッセージ
            io.to(this.room).emit('theme_to_drawer', {theme: this.gametheme[this.turn], drawer: this.drawer});
        }
        else {
            // 描き手以外のプレイターのcanvasを無効化
            socket.emit('lock_canvas', {});
            console.log('キャンバスがロックされました');
        }

        socket.on('msg_to_server', (msg) => {
            if (msg === this.gametheme[this.turn] && socket.id !== this.drawer.id && this.waiting === 0) {
                // 正解処理
                io.to(this.room).emit('game_msg', '<div><b>正解！</b></div>');
                io.to(this.room).emit('count_down_stop', {});
                this.calcPoints(io, socket);
                // 待機状態にする(解答しても無効)
                io.to(this.room).emit('set_waiting_to_client', 1);
                io.to(this.room).emit('lock_canvas', {});
                setTimeout( () => {
                    this.turn++;
                    this.changeDrawer();
                    io.to(this.room).emit('clear_msg', {});
                    io.to(this.room).emit('clear_canvas', {});
                    io.to(this.room).emit('next_turn_to_client', {});
                }, 5000);
            }
        });

        socket.on('next_turn_to_server', () => {
            this.waiting = 0;
            io.to(this.room).emit('unlock_canvas', {});
            if (socket.id === this.drawer.id && this.turn < this.endturn) {
                // タイマースタート
                io.to(this.room).emit('count_down', 0);
                // 現在のターン・描き手を知らせるメッセージ
                io.to(this.room).emit('game_msg', '<br><div><font color="red">----- '+(this.turn+1)+'ターン目 -----</font></div>');
                io.to(this.room).emit('game_msg', '<div>'+this.drawer.name+' が絵を描く番です。</div>');
                // 描き手のみにお題を伝えるメッセージ
                io.to(this.room).emit('theme_to_drawer', {theme: this.gametheme[this.turn], drawer: this.drawer});
            }
            else if (socket.id === this.drawer.id && this.turn === this.endturn) {
                io.to(this.room).emit('unlock_canvas', {});
                io.to(this.room).emit('game_msg', '<div><font size=4>ゲーム終了</font></div>');
                io.to(this.room).emit('game_msg', '<div>最終結果</div>');
                io.to(this.room).emit('game_msg', '<div>p1points:'+this.p1points+' p2points:'+this.p2points+' p3points:'+this.p3points+'</div>');
                io.to(this.room).emit('game_msg', '<div>※ 60秒後に自動退室します</div>');
                setTimeout( () => {
                    console.log('==========ゲーム終了==========');
                    delete io.sockets.adapter.rooms[this.room].battle;
                    io.to(this.room).emit('game_over_to_client', {});
                }, 60000);
            }
            else {
                // 描き手以外のプレイターのcanvasを無効化
                if (this.turn !== this.endturn) {
                    setTimeout( () => {
                        socket.emit('lock_canvas', {});
                    }, 100);
                }
            }
        });

        socket.on('time_up', () => {
            if (socket.id === this.drawer.id) {
                // タイムアップ処理
                io.to(this.room).emit('game_msg', '<div><b>タイムアップ</b></div>');
                // 待機状態にする(解答しても無効)
                io.to(this.room).emit('set_waiting_to_client', 1);
                io.to(this.room).emit('lock_canvas', {});
                setTimeout( () => {
                    this.turn++;
                    this.changeDrawer();
                    io.to(this.room).emit('clear_msg', {});
                    io.to(this.room).emit('clear_canvas', {});
                    io.to(this.room).emit('next_turn_to_client', {});
                }, 5000);
            }
        });

        socket.on('set_waiting_to_server', (data) => {
            this.waiting = data;
        });

        socket.on('game_over_to_server', () => {
            io.to(this.room).emit('game_over', {});
        });
    }


};