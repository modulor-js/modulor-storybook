const managerApp = require('./manager');
const previewApp = require('./preview');

if(inIframe()){
  previewApp();
} else {
  managerApp();
}

function inIframe(){
  return window.self !== window.top;
}

