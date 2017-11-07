const { Router } = require('modulor/router');
const { getStories } = require('../../js/story');
const Channel = require('../../js/channel');
const AddonsApi = require('../../addons');

const stories = getStories();


class PreviewApp extends HTMLElement {
  connectedCallback() {
    const channel = new Channel(window.parent);
    AddonsApi.setChannel(channel);

    const router = new Router({ useHash: true });

    router.add('*', (path, { story, storyKind }) => {
      // probably makes no sence to notify listeners here
      AddonsApi.notifyOnStoryListeners(story, storyKind);

      this.innerHTML = stories[story].renderStory(storyKind);
    });

    router.resolve();
  }
}

customElements.define('sandbox-preview-application', PreviewApp);
