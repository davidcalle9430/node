var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var clients =[];
var activeSockets={};
var messagesQueue={};


var mySQL= require('mysql');
var connection = mySQL.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tgisispuj',
  database : 'rawrdbPrueba'
});


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  console.log("conexión del socket "+ socket);
  

  console.log("Se ha conectado un usuario");
    socket.on('chat_message', function(msg){
      console.log("envían un mensaje de chat");
      var message=msg;
      var receiver= message.receiver;
    
      
      if(typeof(clients[receiver]) != "undefined"){
      console.log("el receptor está conectado y se le envía el mensaje");
      

      
      connection.connect();
      connection.query('INSERT INTO Message SET ?',
      {status:'read',text: message.message, username_receiver:message.receiver, username_sender:message.sender}
      ,function(err, rows, fields) {
        if (!err){
          console.log('Mensaje enviado y almacenado');
          io.to(clients[receiver]).emit('chat_message', msg);
        }else{
          io.to(clients[receiver]).emit('chat_message', msg);
          console.log(err);
          console.log('Error al enviar el mensaje');
        }
      });
      connection.end();
     
      }else{
        console.log("mensaje a alguien no conectado");
       connection.connect();
      connection.query('INSERT INTO Message SET ?',
      {status:'unread',text: message.message, username_receiver:message.receiver, username_sender:message.sender}
      ,function(err, rows, fields) {
        if (!err){
          console.log('Mensaje almacenado');
        }else{

          console.log(err);
          console.log('Error al enviar el mensaje');
        }
      });
      connection.end();
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
    console.log("prueba de borrado "+ clients[username]+ "-"+activeSockets[socket.id]);
    socket.broadcast.emit('disconnect',{user:username});
  });

  socket.on('start_session', function(msg){
    var m = msg;
    console.log("envían un mensaje start_session para "+ m.username);
    clients[m.username]=socket.id;
    activeSockets[socket.id]=m.username;
    var return_list = [];

    for(key in activeSockets){
      return_list.push(activeSockets[key]);
      console.log("está conetado " +activeSockets[key]);
    }

    io.broadcast.emit('response_start_session', JSON.stringify({users:return_list}));
  });
  
});