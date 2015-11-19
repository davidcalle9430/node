
var socket = require('socket.io-client')('https://test-galileo-galileoacmpuj.c9users.io/');
socket.emit('chat_message', 'Masdasd');
socket.on('chat_message', function(){
  console.log("Me llega un mensaje")
});
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});
