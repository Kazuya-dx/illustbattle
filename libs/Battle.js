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
        this.turn = this.p1;
        this.drawer = this.p1;
        this.turn = 6;
        this.gametheme = [];
    }

    getTheme() {
        const tmp = [];
        while (true) {
            if (tmp.length === this.turn) {
                this.gametheme = tmp;
                return 0;
            }
            let num = Math.floor(Math.random() * theme.length);
            if (!tmp.includes(theme[num])) {
                tmp.push(theme[num]);
            }
        };
    };

    calcPoints(socket) {
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
    }

    start(io, socket) {
        if (socket.id === this.drawer.id) {
            io.to(this.room).emit('theme_to_drawer', {theme: this.gametheme[0], drawer: this.drawer});
            console.log('お題は '+this.gametheme[0]+ 'です。');
        }

        socket.on('msg_to_server', (msg) => {
            if (msg === this.gametheme[0] && socket.id !== this.drawer.id) {
                console.log('正解！');
                this.calcPoints(socket);
            }
        });
    }


};