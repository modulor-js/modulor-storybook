const { Router } = require('modulor/router');
const { getStories } = require('../../js/story');
const Channel = require('../../js/channel');
const AddonsApi = require('../../addons');
const Modulor = require('modulor/dom_utils');

const stories = getStories();


class PreviewApp extends HTMLElement {
  connectedCallback() {
    const channel = new Channel(window.parent);
    AddonsApi.setChannel(channel);

    const router = new Router();
    const { story, storyKind } = router.getParams();

    AddonsApi.notifyOnStoryListeners(story, storyKind);

    Modulor.html(this, stories[story].renderStory(storyKind));
  }
}

customElements.define('sandbox-preview-application', PreviewApp);
