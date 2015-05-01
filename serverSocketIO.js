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
    	/*var sender= msg.sender;
    	var receiver= msg.reciever;
    	console.log("se va a enviar el mensaje de " + sender + " "+ receiver);
    	//io.sockets.socket(clients[socket.id]).emit();
        */
    	io.sockets.socket(clients["1"]).emit('chat_message', msg);
 	});

 	socket.on('disconnect', function(){
 		var username = activeSockets[socket.id];
 		delete clients[username];
 		delete activeSockets[socket.id];
 	});

 	socket.on('start_session', function(msg){
 		
 		var m = JSON.parse(msg);
 		console.log('IS username ' +m.username + ' socket '+socket.id );
		clients[m.username]=socket.id;
		activeSockets[socket.id]=m.username;
		//usuarios activos


 	});



  	

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});