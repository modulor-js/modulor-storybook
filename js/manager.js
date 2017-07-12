const story = require('./story');

console.log('application!!!');

console.log(inIframe() ? 'iframe' : 'main', window.location.pathname);

console.log(story.getStories());


function inIframe(){
  return window.self !== window.top;
}

