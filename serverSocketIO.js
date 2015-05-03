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
    	var message=JSON.parse(msg);
    	var receiver= message.receiver;
    	
    	if(typeof(clients[receiver]) != "undefined"){
    	io.to(clients[receiver]).emit('chat_message', msg);
    	//add mysql insert message status received
    	}else{
    	//add mysql insert message status not read
    	}

 	});

 	socket.on('notification', function(msg){
    	var message=JSON.parse(msg);
    	var receiver= message.receiver;
    	io.to(clients[receiver]).emit('notification', msg);
 	});

 	socket.on('disconnect', function(){
 		var username = activeSockets[socket.id];
 		delete clients[username];
 		delete activeSockets[socket.id];
 	});

 	socket.on('start_session', function(msg){
 		var m = JSON.parse(msg);
		clients[m.username]=socket.id;
		activeSockets[socket.id]=m.username;
		//usuarios activos
 	});
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});