window.addEventListener("load", function () {

// Canvas描画に必要な変数を定義する
var canvas = document.getElementById("myCanvas");
var c = canvas.getContext("2d");
var w = 450;
var h = 400;
var drawing = false;
var oldPos;

// Canvasを初期化する
canvas.width = w;
canvas.height = h;
c.strokeStyle = "#000000";
c.chatWidth = 5;
c.chatJoin = "round";
c.chatCap = "round";

// Canvas上の座標を計算する為の関数たち
function scrollX(){
    return document.documentElement.scrollLeft || document.body.scrollLeft;
};
function scrollY(){
    return document.documentElement.scrollTop || document.body.scrollTop;
};
function getPos (event) {
    var mouseX = event.clientX - $(canvas).position().left + scrollX();
    var mouseY = event.clientY - $(canvas).position().top + scrollY();
    return {x:mouseX, y:mouseY};
}
function getPosT (event) {
    var mouseX = event.touches[0].clientX - $(canvas).position().left + scrollX();
    var mouseY = event.touches[0].clientY - $(canvas).position().top + scrollY();
    return {x:mouseX, y:mouseY};
}

// ここからは、Canvasに描画する為の処理                             
canvas.addEventListener("mousedown", function (event) {
    console.log("mousedown");
    drawing = true;
    oldPos = getPos(event);
}, false);
canvas.addEventListener("mouseup", function () {
    console.log("mouseup");
    drawing = false;
}, false);
canvas.addEventListener("mousemove", function (event) {
    var pos = getPos(event);
    console.log("mousemove : x=" + pos.x + ", y=" + pos.y + ", drawing=" + drawing);
    if (drawing) {
        c.beginPath();
        c.moveTo(oldPos.x, oldPos.y);
        c.chatTo(pos.x, pos.y);
        c.stroke();
        c.closePath();
         
        // socket.IOサーバーに、
        // どの点からどの点までを描画するかをの情報を送付する
        socket.emit("draw", {before:oldPos, after:pos});
        oldPos = pos;
    }
}, false);
canvas.addEventListener("mouseout", function () {
    console.log("mouseout");
    drawing = false;
}, false);
     
// 色や太さを選択した場合の処理
// 選択した結果を、Canvasに設定して、
// socket.IOサーバーにも送付している
$("#black").click(function () {c.strokeStyle = "black";socket.emit("color", "black");});
$("#blue").click(function () {c.strokeStyle = "blue";socket.emit("color", "blue");});
$("#red").click(function () {c.strokeStyle = "red";socket.emit("color", "red");});
$("#green").click(function () {c.strokeStyle = "green";socket.emit("color", "green");});
$("#small").click(function () {c.chatWidth = 5;socket.emit("chatWidth", 5);});
$("#middle").click(function () {c.chatWidth = 10;socket.emit("chatWidth", 10);});
$("#large").click(function () {c.chatWidth = 20;socket.emit("chatWidth", 20);});
    
// socket.IOサーバーから描画情報を受け取った場合の処理
// 受け取った情報を元に、Canvasに描画を行う
socket.on("draw", function (data) {
    console.log("on draw : " + data);
    c.beginPath();
    c.moveTo(data.before.x, data.before.y);
    c.chatTo(data.after.x, data.after.y);
    c.stroke();
    c.closePath();
});

// socket.IOサーバーから色情報を受け取った場合の処理
// Canvasに色を設定している
socket.on("color", function (data) {
    console.log("on color : " + data);
    c.strokeStyle = data;
});

    
// socket.IOサーバーから線の太さ情報を受け取った場合の処理
// Canvasに線の太さを設定している
socket.on("chatWidth", function (data) {
    console.log("on chatWidth : " + data);
    c.chatWidth = data;
});

                        
}, false);