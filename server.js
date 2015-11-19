var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log("Conexión nueva");
  socket.on('chat_message', function(msg){
    io.emit('chat_message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
