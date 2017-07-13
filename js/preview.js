const { Delegate } = require('ascesis/delegate');
const { Router } = require('ascesis/router');
const { getStories } = require('./story');

const stories = getStories();


console.log('preview app init', stories);

const router = new Router({ useHash: true });

const $container = document.querySelector('#container');

router.add('/:story/:substory?', (story, substory) => {
  //redirect to first substory path
  console.log('preview', story, substory);
  $container.innerHTML = (stories[story][substory] || (() => ``))()
});

router.resolve();
