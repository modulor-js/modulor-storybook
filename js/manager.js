const { storyOf, getStories } = require('./story');

console.log('application!!!');

console.log(inIframe() ? 'iframe' : 'main', window.location.pathname);

console.log(getStories());

if(inIframe()){
}


function inIframe(){
  return window.self !== window.top;
}

