'use strict';

// モジュール
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Game = require('./libs/Game.js');

// オブジェクト
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {origins:'localhost:* 127.0.0.1:3000'});

// 定数
const PORT_NO = process.env.PORT || 3000;

// ゲームの作成と開始
// (ここは4人集まった部屋ごとにgameをするようにしたい)
const game = new Game();
game.start(io);

// 公開フォルダの指定
app.use(express.static(__dirname + '/public'));

// ルーティング
app.get('/disconnect', (req, res) => {
    res.sendFile(__dirname + '/public/disconnect.html');
});

// サーバーの起動
server.listen(PORT_NO, () => {
    console.log('Starting server on port %d', PORT_NO);
});