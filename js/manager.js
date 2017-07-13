const { storyOf, getStories } = require('./story');

const stories = getStories();

if(inIframe()){
  previewApp();
} else {
  managerApp();
}

function previewApp(){
  console.log('preview app init', stories);
}

function managerApp(){
  console.log('manager app init', stories);
}

function inIframe(){
  return window.self !== window.top;
}

