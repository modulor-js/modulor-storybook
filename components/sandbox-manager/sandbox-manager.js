const Split = require('split.js');
const { fireEvent } = require('modulor');
const { delegate } = require('modulor/delegate');
const { Router } = require('modulor/router');
const { getStories } = require('../../js/story');
const Channel = require('../../js/channel');
const AddonsApi = require('../../addons');

const template = require('./sandbox-manager.html');

require('../addons-panel/addons-panel');
require('../stories-tree/stories-tree');
require('../preview-frame/preview-frame');
require('../storybook-branding/storybook-branding');


const createElement = (name, attributes) => {
  const $el = document.createElement(name);
  Object.keys(attributes).forEach((attr) => {
    if (attr in $el) {
      $el[attr] = attributes[attr];
    } else {
      $el.setAttribute(attr, attributes[attr]);
    }
  });
  return $el;
};

class ManagerApp extends HTMLElement {
  connectedCallback() {
    this.mobile = this.hasAttribute('mobile');
    this.branding = JSON.parse(this.getAttribute('branding') || '{}');
    this.removeAttribute('branding');
    this._stories = getStories();
    this.stories = getStories();
    const firstStory = this.stories[Object.keys(this.stories)[0]];
    const addonPanels = AddonsApi.getPanels();

    const DEFAULT_PARAMS = {
      width: 80,
      height: 75,
      story: firstStory.storyName,
      storyKind: Object.keys(firstStory.getStories())[0],
      addon: Object.keys(addonPanels)[0],
    };

    this.router = new Router({
      base: window.location.pathname,
    });

    this.state = Object.assign({}, DEFAULT_PARAMS, this.router.getParams());

    this.render();

    // handle state change
    delegate.on('size-changed', this, null, this.updateState.bind(this));
    delegate.on('addon-changed', this, null, this.updateState.bind(this));
    delegate.on('story-changed', this, null, this.updateState.bind(this));

    delegate.on('story-changed', this, null, ({ eventData }) => {
      this.renderStory(this.state.story, this.state.storyKind);
    });


    /*  routing
     *  here all routes changes will be observed
     *  only query parameters will be used
     * */
    this.router.add('*', (path, query) => {
      if (!this.mobile) {
        // set sizes
        const width = Number(query.width);
        const height = Number(query.height);
        this.vSplit.setSizes([100 - width, width]);
        this.hSplit.setSizes([height, 100 - height]);
      }

      // set active addons panel
      this.$addonsPanel.setActive(query.addon);

      // set active story in this.stories tree
      this.$storiesStree.setActive(query.story, query.storyKind);

      this.renderStory(query.story, query.storyKind);
    });

    // initial update of paramters + router resolve
    this.router.updateParams(this.state, { replace: true });
  }

  render() {
    this.innerHTML = template({
      mobile: this.mobile,
    });

    document.body.classList[this.mobile ? 'add' : 'remove']('mobile');

    const addonPanels = AddonsApi.getPanels();
    // build panels
    this.$leftPanel = this.querySelector('#left-panel');

    this.$storiesStree = createElement('stories-tree', {
      class: 'tree',
      state: this.stories,
    });
    const leftPanelContainer = createElement('div', {
      class: `${this.mobile ? '' : 'split content'} tree-container`,
    });
    leftPanelContainer.innerHTML = `<storybook-branding
        name="${this.branding.name}"
        logo="${this.branding.logo}"
      ></storybook-branding>`;
    leftPanelContainer.appendChild(this.$storiesStree);
    this.$leftPanel.appendChild(leftPanelContainer);

    /*  build right panels
     *  correct order of components creation matters a lot here
     *  channel should be established before rendering plugins
     * */
    this.$rightPanel = this.querySelector('#right-panel');

    this.$rightPanel.appendChild(this.$previewFrame = createElement('preview-frame', {
      class: `${this.mobile ? '' : 'split'} content`,
      'url-base': this.router.options.base,
    }));

    this.$previewFrame.render();
    const channel = new Channel(this.$previewFrame.getWindow());
    AddonsApi.setChannel(channel);

    window.addEventListener('resize', this.adapt.bind(this));
    this.adapt();

    this.$rightPanel.appendChild(this.$addonsPanel = createElement('sandbox-addons-panel', {
      class: `${this.mobile ? '' : 'split'} content`,
      state: addonPanels,
    }));

    this.splitPanes();
  }

  splitPanes() {
    if (this.mobile) {
      return;
    }
    // resizable grid
    const _self = this;

    this.vSplit = Split([this.$leftPanel, this.$rightPanel], {
      gutterSize: 8,
      cursor: 'col-resize',
      onDragEnd() {
        const width = Math.round(_self.vSplit.getSizes()[1]);
        fireEvent('size-changed', _self, { width });
      },
    });

    this.hSplit = Split([this.$previewFrame, this.$addonsPanel], {
      direction: 'vertical',
      gutterSize: 8,
      cursor: 'row-resize',
      onDragEnd() {
        const height = Math.round(_self.hSplit.getSizes()[0]);
        fireEvent('size-changed', _self, { height });
      },
    });
  }

  // render active story in frame + notify onStory listeners
  renderStory(story, storyKind) {
    this.$previewFrame.setActive(story, storyKind);

    AddonsApi.notifyOnStoryListeners(story, storyKind);
  }

  // update manager state + silent update of query paramters
  updateState({ eventData }) {
    this.state = Object.assign({}, this.state, eventData);
    this.router.updateParams(this.state, { silent: true });
  }

  events() {
    return {
      mobile: this.forMobile,
      filter(query) {
        this.events && this.events.filter(query);
      },
    };
  }

  forMobile(setMobile) {
    const oldMobileState = this.hasAttribute('mobile');
    setMobile ? this.setAttribute('mobile', true) : this.removeAttribute('mobile');
    if (oldMobileState !== this.hasAttribute('mobile')) {
      this.mobile = setMobile;
      this.render();
    }
  }

  adapt() {
    this.forMobile(window.innerWidth <= 600);
  }
}

customElements.define('sandbox-manager-application', ManagerApp);
