var socket = new WebSocket("wss://anysync-test.herokuapp.com");

var worker = new Worker("worker.js");

var client_time1 = 0;
var client_time2 = 0;
var server_offset = 0;



function play_music(){
    worker.postMessage('load_music');
}

function change_color(){
    console.log('Color changed');
    $('.check_elem').css('background-color', 'blue');
    setTimeout(play_music, 0);
}

socket.onopen = function(event) {
    console.log('Session opened');
    client_time1 = new Date().getTime();
    socket.send('get_time');
}

socket.onmessage = function(event) {
    console.log("Received" + event.data);
    if(event.type === 'message'){
        var input = JSON.parse(event.data);
        console.log("JSON parsed");
        if(input.data_type === 'server_time'){
            client_time2 = new Date().getTime();
            server_offset = (client_time2 + client_time1) / 2 - input.data;
            console.log("Server offset " + server_offset);
        }
        else if(input.data_type === 'action_time'){
            console.log('Action time received');
            var action_time = input.data + server_offset;
            var current_delay = action_time - Date.now();
            console.log('Current delay is ' + current_delay + ' ms');
            setTimeout(change_color, current_delay);
        }
    }
};

$(document).ready(function(){
    $('.check_elem').click(function(){
        console.log('Event requested');
        socket.send('event_start');
    });
});