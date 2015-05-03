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
		   console.log("envían un mensaje de chat");
    	var message=JSON.parse(msg);
    	var receiver= message.receiver;
    	
    	if(typeof(clients[receiver]) != "undefined"){
    	io.to(clients[receiver]).emit('chat_message', msg);
    	//add mysql insert message status received
    	}else{
    	//add mysql insert message status not read
    	}

 	});
	 
	 socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
	console.log("llega un mensaje new message ");
    	socket.broadcast.emit('new message', {
      		username: socket.username,
      		message: data
    	});
  	});

 	socket.on('notification', function(msg){
		 console.log("envían un mensaje notification");
    	var message=JSON.parse(msg);
    	var receiver= message.receiver;
    	io.to(clients[receiver]).emit('notification', msg);
 	});

 	socket.on('disconnect', function(){
 		var username = activeSockets[socket.id];
		console.log("El usuario "+ username+ " se ha desconectado");
 		delete clients[username];
 		delete activeSockets[socket.id];
 	});

 	socket.on('start_session', function(msg){
		console.log("envían un mensaje start_session");
 		var m = JSON.parse(msg);
		clients[m.username]=socket.id;
		activeSockets[socket.id]=m.username;
 	});
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});