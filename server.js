var server = require('websocket').server, http = require('http');

var socket = new server({
    httpServer: http.createServer().listen(1337)
});

socket.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var cantidad=0;
    connection.on('message', function(message) {
        console.log(message.utf8Data);
        connection.sendUTF('hello');
        setTimeout(function() {
            connection.sendUTF('Hola, eres el usuario '+ cantidad);
            cantidad++;
        }, 1000);
    });

    connection.on('close', function(connection) {
        console.log('connection closed');
    });
}); 