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

    start(io, socket) {
        if (socket.id === this.drawer.id) {
            io.to(this.room).emit('theme_to_drawer', {theme: this.gametheme[0], drawer: this.drawer});
            console.log('お題は '+this.gametheme[0]+ 'です。');
        }

        socket.on('msg_to_server', (msg) => {
            if (msg === this.gametheme[0]) {
                console.log('正解！');
            }
        });
    }


};