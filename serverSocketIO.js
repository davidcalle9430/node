var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients =[];

app.get('/', function(req, res){
  res.sendFile(__dirname +'/index.html');
});

io.on('connection', function(socket){

	console.log("usuarios actuales");
	for (var i in clients) {
		console.log(i);
	};

  socket.on('chat message', function(msg){
  	clients.push(socket.index);
    console.log( "el usuario "+ socket.id + ' envía message: ' + msg);
    io.emit('chat message', msg);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});