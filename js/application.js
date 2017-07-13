//deprecated!
if(inIframe()){
  require('./manager')();
} else {
  require('./preview')();
}

function inIframe(){
  return window.self !== window.top;
}

