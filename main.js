var express = require('express');
var app = express();
var http = require('http').Server(app);
var WebSocketServer = require('websocket').server;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/start_page/index.html');
});

app.use('/start_page', express.static(__dirname + '/start_page'));

wsServer = new WebSocketServer({
    httpServer: http
});

var connection_buffer = new Array();

wsServer.on('request', function(request){
    var conn_number = connection_buffer.length;
    connection_buffer.push(request.accept(null, request.origin));
    
    connection_buffer[conn_number].on('message', function(message){
        if(message.utf8Data == 'get_time'){
            var output = new Object();
            output.data_type = 'server_time';
            output.data = Date.now();
            output = JSON.stringify(output);
            console.log(output);
            connection_buffer[conn_number].send(output);
            console.log('Time sent');
        }
        else if(message.utf8Data === 'event_start'){
            var output = new Object();
            output.data_type = 'action_time';
            output.data = Date.now() + 2000;
            output = JSON.stringify(output);
            for(var i = 0; i < connection_buffer.length; i++){
                connection_buffer[i].send(output);
            }
            console.log('Action time broadcast completed');
        }
    });

    connection_buffer[conn_number].on('close', function(){
        console.log('Connection closed');
    });
});

var port = process.env.PORT || 54321;

http.listen(port, function(){
    console.log('listening on port ' + port);
});