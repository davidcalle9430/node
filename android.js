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

function handleDisconnect() {
  connection = MySQL.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}



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
  handleDisconnect();
  console.log("Se ha conectado un usuario");
  socket.on('chat_message', function(msg){
  handleDisconnect();
  var message=msg;
  var receiver= message.receiver;
  console.log("envían un mensaje de chat para "+ receiver);
      if(typeof(clients[receiver]) != "undefined"){
        console.log("el receptor está conectado y se le envía el mensaje");
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
      }else{
        
        console.log("mensaje a alguien no conectado");
        connection.connect();
        connection.query('INSERT INTO Message SET ?',
        {status:'unread',text: message.message, username_receiver:message.receiver, username_sender:message.sender}
          ,function(err, rows, fields) {
              if (!err){
                console.log('Mensaje almacenado');
                io.to(clients[receiver]).emit('chat_message', msg);
              }else{
                io.to(clients[receiver]).emit('chat_message', msg);
                console.log(err);
                console.log('Error al enviar el mensaje');
        }
      });
    }
  });
  

  socket.on('notification', function(msg){
    handleDisconnect();
    console.log("envían un mensaje notification");
    var message=JSON.parse(msg);
    var receiver= message.receiver;
    io.to(clients[receiver]).emit('notification', msg);
  });

  socket.once('disconnect', function(){
     handleDisconnect();
    var username = activeSockets[socket.id];
    console.log("El usuario "+ username+ " se ha desconectado");
    
    delete clients[username];
    delete activeSockets[socket.id];
    socket.broadcast.emit('disconnect',{user:username});
  });

  socket.on('start_session', function(msg){
    handleDisconnect();
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