function post(){
    postMessage('lul');
}

onmessage = function(event){
    setTimeout(post, event.data);
    console.log("Timeout = " + event.data);
}