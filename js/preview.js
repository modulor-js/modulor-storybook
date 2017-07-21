const { Delegate } = require('ascesis/delegate');
const { Router } = require('ascesis/router');
const { getStories } = require('./story');
const AddonsApi = require('./addons');
const Channel = require('./channel');

const stories = getStories();


class PreviewApp extends HTMLElement {
  connectedCallback(){
    const channel = new Channel(window.parent);
    AddonsApi.setChannel(channel);

    const router = new Router({ useHash: true });

    router.add('/:story/:substory?', (story, substory) => {
      //redirect to first substory path
      AddonsApi.notifyOnStoryListeners(story, substory);
      this.innerHTML = stories[story].renderStory(substory);
    });

    router.resolve();
  }
}

customElements.define('sandbox-preview-application', PreviewApp);
