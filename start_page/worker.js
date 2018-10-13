//var audio_signal = new Audio();
//audio_signal.src = 'start_page/memas.mp3';
var c = document.createElement('audio'); 
c.src='start_page/memas.mp3'; 

onmessage = function(event){
    c.play();
}