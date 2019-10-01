'use strict';  // 厳格モードとする

// オブジェクト
const name = prompt('名前を入力してください');
joinUser(name);

// 入室時の処理
function joinUser(name) {
    socket.emit('join_user', {name: name});
};

// 部屋ごとにゲームスタート
socket.on('enter_the_game', () => {
    socket.emit('enter_the_game', {});
});

// 切断にてゲーム中断した時の処理
socket.on('refresh', () => {
    setTimeout( () => {
        window.location.href = 'http://127.0.0.1:3000/disconnect/';
    });
});