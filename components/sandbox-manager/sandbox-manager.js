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

const SIZES = {
  width: 80,
  height: 75,
  gutter: 8,
  breakpoint: 600,
};

const createElement = (name, attributes) => {
  const $el = document.createElement(name);
  console.log($el.type, $el)
  Object.keys(attributes).forEach((attr) => {
    if (attr in $el) {
      $el[attr] = attributes[attr];
    } else {
      const value = typeof attributes[attr] !== 'string' ? JSON.stringify(attributes[attr]) : attributes[attr];
      $el.setAttribute(attr, value);
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

    const DEFAULT_PARAMS = Object.assign({}, SIZES, {
      story: firstStory.storyName,
      storyKind: Object.keys(firstStory.getStories())[0],
      addon: Object.keys(addonPanels)[0],
    });

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

    window.addEventListener('resize', this.adapt.bind(this));
    this.adapt();

    /*  routing
     *  here all routes changes will be observed
     *  only query parameters will be used
     * */
    this.router.add('*', (path, query) => {
      this.paneSizes({ width: query.width, height: query.height });

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
      class: `${this.mobile ? 'hidden' : ''} tree`,
      state: this.stories,
    });
    const leftPanelContainer = createElement('div', {
      class: `${this.mobile ? '' : 'split content'} tree-container`,
    });

    leftPanelContainer.appendChild(this.$branding = createElement('storybook-branding', {
      name: this.branding.name,
      logo: this.branding.logo,
    }));
    leftPanelContainer.appendChild(this.$storiesStree);
    this.$leftPanel.appendChild(leftPanelContainer);
    this.$branding.setEvents(this.events());

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

    this.$rightPanel.appendChild(this.$addonsPanel = createElement('sandbox-addons-panel', {
      class: `${this.mobile ? 'hidden' : 'split'} content`,
      state: addonPanels,
    }));

    this.splitPanes();
    this.paneSizes({ width: this.state.width, height: this.state.height });
  }

  splitPanes() {
    if (this.mobile) {
      return;
    }
    // resizable grid
    const _self = this;

    this.vSplit = Split([this.$leftPanel, this.$rightPanel], {
      gutterSize: SIZES.gutter,
      cursor: 'col-resize',
      minSize: 250,
      onDragEnd() {
        const width = Math.round(_self.vSplit.getSizes()[1]);
        fireEvent('size-changed', _self, { width });
      },
    });

    this.hSplit = Split([this.$previewFrame, this.$addonsPanel], {
      direction: 'vertical',
      gutterSize: SIZES.gutter,
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
      isMobile: () => this.mobile,
      mobile: this.toggleMobile.bind(this),
      tree: () => {
        this.$storiesStree.classList[this.$storiesStree.classList.contains('hidden') ? 'remove' : 'add']('hidden');
        this.paneSizes();
      },
      filter(query) {
        this.events && this.events.filter(query);
      },
    };
  }

  toggleMobile(setMobile) {
    const oldMobileState = this.hasAttribute('mobile');
    if (oldMobileState !== setMobile) {
      this.mobile = setMobile;
      this[setMobile ? 'setAttribute' : 'removeAttribute']('mobile', setMobile);
      this.render();
    }
  }

  adapt() {
    this.toggleMobile(window.innerWidth <= SIZES.breakpoint);
  }

  paneSizes(query) {
    if (!this.mobile) {
      // set sizes
      const width = Number(query.width);
      const height = Number(query.height);
      this.vSplit.setSizes([100 - width, width]);
      this.hSplit.setSizes([height, 100 - height]);
    } else {
      this.$leftPanel.removeAttribute('style');
      const height = this.$leftPanel.getBoundingClientRect().height;
      this.$leftPanel.style.height = `${height}px`;
      this.$rightPanel.style.height = `calc( 100% - ${height}px )`;
    }
  }
}

customElements.define('sandbox-manager-application', ManagerApp);
