var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients =[];
var activeSockets=[];
var messagesQueue=[];


app.get('/', function(req, res){
  res.sendFile(__dirname +'/index.html');
});

io.on('connection', function(socket){
	
	
   	socket.on('chat_message', function(msg){
    	var sender= msg.sender;
    	var receiver= msg.reciever;
    	//io.sockets.socket(clients[socket.id]).emit();
    	io.emit('chat_message', msg);
 	});

 	socket.on('disconnect', function(){
 		console.log("el usuario se ha desconectado");
 		var username = activeSockets[socket.id];
 		delete clients[username];
 		delete activeSockets[socket.id];
 		

 	});

 	socket.on('start_session', function(msg){
		clients[msg.username]=socket.id;
		activeSockets[socket.id]=msg.username;
 	});



  	

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});