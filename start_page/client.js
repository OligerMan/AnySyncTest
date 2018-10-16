var socket = new WebSocket("wss://anysync-test.herokuapp.com");

var worker = new Worker("start_page/worker.js");

var client_time1 = 0;
var client_time2 = 0;
var server_offset = 0;


var audio_signal = new Audio();
audio_signal.src = 'start_page/memas.mp3';

worker.onmessage = function(){
    audio_signal.play();
    $('.check_elem').css('background-color', 'blue');
}

function check_timeout(){
    client_time1 = new Date().getTime();
    socket.send('get_time');
}

socket.onopen = function(event) {
    console.log('Session opened');
    check_timeout();
    check_timeout();
    check_timeout();
    check_timeout();
    check_timeout();
    setInterval(check_timeout, 1000);
}

socket.onmessage = function(event) {
    //console.log("Received" + event.data);
    if(event.type === 'message'){
        var input = JSON.parse(event.data);
        //console.log("JSON parsed");
        if(input.data_type === 'server_time'){
            client_time2 = new Date().getTime();
            var new_server_offset = (client_time2 + client_time1) / 2 - input.data;
            if(server_offset === 0){
                server_offset = new_server_offset;
            }else{
                server_offset = server_offset / 5 * 4 + new_server_offset / 5;
            }
            console.log("Server offset " + server_offset);
            console.log("Server time" + input.data);
        }
        else if(input.data_type === 'action_time'){
            console.log('Action time received');
            var action_time = input.data + server_offset;
            var current_delay = action_time - Date.now();
            console.log('Current delay is ' + current_delay + ' ms');
            console.log('Action time is ' + action_time);
            worker.postMessage(current_delay);
        }
    }
};

$(document).ready(function(){
    $('.check_elem').click(function(){
        console.log('Event requested');
        socket.send('event_start');
    });
});