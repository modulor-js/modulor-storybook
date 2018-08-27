const { Router } = require('modulor/router');
const { getStories } = require('../../js/story');
const Channel = require('../../js/channel');
const AddonsApi = require('../../addons');
const { safeRender } = require('../../js/helpers');


const stories = getStories();


class PreviewApp extends HTMLElement {
  connectedCallback() {
    const channel = new Channel(window.parent);
    AddonsApi.setChannel(channel);

    const router = new Router();
    const { story, storyKind } = router.getParams();

    AddonsApi.notifyOnStoryListeners(story, storyKind);

    const storyContent = stories[story].renderStory(storyKind);

    safeRender(this, storyContent);
  }
}

customElements.define('sandbox-preview-application', PreviewApp);
