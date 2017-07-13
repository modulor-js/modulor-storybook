const Split = require('split.js');
const { Delegate } = require('ascesis/delegate');
const { Router } = require('ascesis/router');
const { storyOf, getStories } = require('./story');

const storiesTreeTemplate = require('../templates/stories_tree.html');

const stories = getStories();
const router = new Router({ useHash: true });

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

  Split(['.left-panel', '.right-panel'], {
    sizes: [20, 80],
    gutterSize: 8,
    cursor: 'col-resize'
  });

  Split(['#preview-block', '#info-block'], {
    direction: 'vertical',
    sizes: [25, 75],
    gutterSize: 8,
    cursor: 'row-resize'
  });

  document.querySelector('#stories-tree').innerHTML = storiesTreeTemplate({ stories });

  router.add('/:story/:substory?', (story, substory) => {
    //redirect to first substory path
    console.log(story, substory);
  });

  router.add('/', () => {
    //redirect to first story path
    console.log('root route');
  });

  router.resolve();

}

function inIframe(){
  return window.self !== window.top;
}

