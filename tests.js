var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:3000/';
var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'username':'TorredM'};
var chatUser2 = {'username':'JaimeP'};
var chatUser3 = {'username':'AlfredoS'};

describe("doAsync",function(){
	this.timeout(3000);

	/*
	* 
	* Prueba unitaria 1, 
	* avisar a todos los clientes sobre una conexión nueva
	* 
	*/
	
	it('Should notify new connection', function(done){
	  var client1 = io.connect(socketURL, options);
	  var client2 = io.connect(socketURL, options);
	  
		client1.on('response_start_session', function(data1){
	  	 		var connectedUser = JSON.parse(data1);
	  			connectedUser.users[0].should.equal(chatUser2['username']);
				connectedUser.users[0].should.equal("JaimeP");
	 	});
	 	client2.emit('start_session', chatUser2);
	 	client2.emit('hint', {hint:'p'});
	 	done();

	});
	/*
	* 
	* Prueba unitaria 2, 
	* Debe Enviar y Recibir Mensajes
	* 
	*/
	it('Should send and receive messages', function(done){
	  var client1 = io.connect(socketURL, options);
	  var client2 = io.connect(socketURL, options);
	  
		client1.on('response_start_session', function(data1){
	  	 		var connectedUser = JSON.parse(data1);
	  			connectedUser.users[0].should.equal(chatUser2['username']);
				connectedUser.users[0].should.equal("JaimeP");
	 	});
	 	client2.emit('start_session', chatUser2);
	 	done();

	});




});