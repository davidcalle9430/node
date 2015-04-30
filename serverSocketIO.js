var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients =[];
var activeSockets=[];
var messagesQueue=[];
/*En este Queue se meten todos lso mensajes que que no se pudieron enviar ya que no existía un client[user] */
/*La llave valor debería ser username => socket */
app.get('/', function(req, res){
  res.sendFile(__dirname +'/index.html');
});

io.on('connection', function(socket){
	
	clients.push(socket.id);

	console.log("usuarios actuales");
	for (var i in clients) {
		console.log(clients[i]);
	}
	//esto debería ser algo del estilo de clientes[username]= socket.id
    
	

  	socket.on('chat message', function(msg){
    console.log( "el usuario "+ socket.id + ' envía message: ' + msg);
    io.emit('chat message', msg);
 	});

 	socket.on('disconnect', function(){
 	 console.log("el usuario se ha desconectado");
     // borrarDatos();
 	});

 	socket.on('start_session', function(msg){
     // ingresarDatos();
 	});



  	

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});