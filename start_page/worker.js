var audio_signal = new Audio();
audio_signal.src = 'start_page/memas.mp3';

onmessage = function(event){
    audio_signal.play();
}