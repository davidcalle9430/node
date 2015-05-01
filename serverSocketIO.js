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
	console.log("Se ha conectado un usuario");
	
   	socket.on('chat_message', function(msg){
    	var sender= msg.sender;
    	var receiver= msg.reciever;
    	console.log("se va a enviar el mensaje de " + sender + " "+ receiver);
    	//io.sockets.socket(clients[socket.id]).emit();
    	io.emit('chat_message', "mensaje X");
    	io.emit('chat_message', msg);
 	});

 	socket.on('disconnect', function(){
 		console.log("el usuario se ha desconectado");
 		var username = activeSockets[socket.id];
 		delete clients[username];
 		delete activeSockets[socket.id];
 		
 		console.log("Se desconectado un usuario");
 	});

 	socket.on('start_session', function(msg){
 		console.log('se ha enviado un mensaje de inicio de sesión');
		clients[msg.username]=socket.id;
		activeSockets[socket.id]=msg.username;
 	});



  	

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});