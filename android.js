 var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var clients =[];
var activeSockets={};
var messagesQueue={};


var mySQL= require('mysql');
var db_config = {
    host: 'localhost',
    user: 'root',
    password: 'tgisispuj',
    database: 'rawrdbPrueba'
};
var connection = mySQL.createConnection(db_config);
var pool  = mySQL.createPool(db_config);

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
var usernames = {};
var numUsers = 0;



io.on('connection', function (socket) {
  console.log("conexión del socket "+ socket);
 
  console.log("Se ha conectado un usuario");
  socket.on('chat_message', function(msg){

  var message=msg;
  var receiver= message.receiver;
  console.log("envían un mensaje de chat para "+ receiver);
      if(typeof(clients[receiver]) != "undefined"){
        console.log("el receptor está conectado y se le envía el mensaje");


         pool.getConnection(function(err, connection){
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

     });


      }else{
        
        console.log("mensaje a alguien no conectado");
        pool.getConnection(function(err, connection){
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
     });


    }
  });
  

  socket.on('notification', function(msg){
    
    console.log("envían un mensaje notification");
    var message=JSON.parse(msg);
    var receiver= message.receiver;
    io.to(clients[receiver]).emit('notification', msg);
  });

  socket.once('disconnect', function(){
   
    var username = activeSockets[socket.id];
    console.log("El usuario "+ username+ " se ha desconectado");
    
    delete clients[username];
    delete activeSockets[socket.id];
    socket.broadcast.emit('disconnect',{user:username});
  });

  socket.on('start_session', function(msg){
  
    var m = msg;
    console.log("envían un mensaje start_session para "+ m.username);
    clients[m.username]=socket.id;
    console.log("ahora en clients está "+ clients[m.username]);
    activeSockets[socket.id]=m.username;
    var return_list = [];

    for(key in activeSockets){
      return_list.push(activeSockets[key]);
      console.log("está conetado " +activeSockets[key]);
    }

    io.emit('response_start_session', JSON.stringify({users:return_list}));
  });
  
});