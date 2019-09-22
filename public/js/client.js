'use strict';  // 厳格モードとする

// オブジェクト
const socket = io.connect();
const name = prompt('名前を入力してください');
joinUser(name);

// 入室時の処理
function joinUser(name) {
    let roomId = 1;
    socket.emit('join_user', { room: roomId, name: name});
};
