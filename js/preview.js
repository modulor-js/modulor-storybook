const { Delegate } = require('ascesis/delegate');
const { Router } = require('ascesis/router');
const { getStories } = require('./story');
const Channel = require('./channel');

const channel = new Channel(window.parent);
const stories = getStories();


class PreviewApp extends HTMLElement {
  connectedCallback(){
    const router = new Router({ useHash: true });

    router.add('/:story/:substory?', (story, substory) => {
      //redirect to first substory path
      this.innerHTML = stories[story].renderStory(substory);
    });

    router.resolve();
  }
}

customElements.define('sandbox-preview-application', PreviewApp);
