// グローバル変数
const theme = [
    'スカイツリー', '東京タワー', 'イチロー', 'マリオ', '相撲', '闇遊戯',
    '大乱闘スマッシュブラザーズ', 'タピオカ', '渋谷', '宇宙',
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
        this.turn = 1;
        this.endturn = 6;
        this.gametheme = [];
    }

    getTheme() {
        const tmp = [];
        while (true) {
            if (tmp.length === this.endturn) {
                this.gametheme = tmp;
                return 0;
            }
            let num = Math.floor(Math.random() * theme.length);
            if (!tmp.includes(theme[num])) {
                tmp.push(theme[num]);
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
        console.log('p1points:'+this.p1points+' p2points:'+this.p2points+' p3points:'+this.p3points);
        io.to(this.room).emit('game_msg', '<div>p1points:'+this.p1points+' p2points:'+this.p2points+' p3points:'+this.p3points+'</div>');
    }

    changeDrawer() {
        if (this.drawer === this.p1) this.drawer = this.p2;
        else if (this.drawer === this.p2) this.drawer = this.p3;
        else this.drawer = this.p1;
        this.turn++;
    }

    start(io, socket) {
        if (socket.id === this.drawer.id) {
            // 現在のターン・描き手を知らせるメッセージ
            io.to(this.room).emit('game_msg', '<br><div><font color="red">----- '+this.turn+'ターン目 -----</font></div>');
            io.to(this.room).emit('game_msg', '<div>'+this.drawer.name+' が絵を描く番です。</div>');
            // 描き手のみにお題を伝えるメッセージ
            io.to(this.room).emit('theme_to_drawer', {theme: this.gametheme[this.turn], drawer: this.drawer});
            console.log('お題は '+this.gametheme[this.turn]+ 'です。');
        }

        socket.on('msg_to_server', (msg) => {
            if (msg === this.gametheme[this.turn] && socket.id !== this.drawer.id) {
                io.to(this.room).emit('game_msg', '<div><b>正解！</b></div>');
                console.log('正解！');
                this.calcPoints(io, socket);
                this.changeDrawer();
                io.to(this.room).emit('next_turn_to_client', {});
            }
        });

        socket.on('next_turn_to_server', (data) => {
            if (this.turn === this.endturn) {
                console.log('==========ゲーム終了==========');
            }
            if (socket.id === this.drawer.id) {
                // 現在のターン・描き手を知らせるメッセージ
                io.to(this.room).emit('game_msg', '<br><div><font color="red">----- '+this.turn+'ターン目 -----</font></div>');
                io.to(this.room).emit('game_msg', '<div>'+this.drawer.name+' が絵を描く番です。</div>');
                // 描き手のみにお題を伝えるメッセージ
                io.to(this.room).emit('theme_to_drawer', {theme: this.gametheme[this.turn], drawer: this.drawer});
                console.log('お題は '+this.gametheme[this.turn]+ 'です。');
            }
        });
    }


};