function post(){
    postMessage('lul');
}

onmessage = function(event){
    setTimeout(post, event);
}