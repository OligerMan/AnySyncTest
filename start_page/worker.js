function post(){
    postMessage();
}

onmessage = function(event){
    setTimeout(post, event.timeout);
}