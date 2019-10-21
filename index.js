var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log(`${new Date().toLocaleString()} - a user connected`);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('send-nickname', function(nickname) {
        socket.nickname = nickname;
        users.push(socket.nickname);
        
        io.emit('system info', `${new Date().toLocaleString()} - ${nickname} has joined the chat`);
    });
    socket.on('chatmessage', function(msg){
        console.log(`${new Date().toLocaleString()} - Broadcasting message: "${msg.text}" from ${msg.id}`);
        io.emit('chatmessage', msg);
    });
});

http.listen(3000, function(){
  console.log(`${new Date().toLocaleString()} - listening on *:3000`);
});
