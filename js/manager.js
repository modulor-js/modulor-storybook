const Split = require('split.js');
const { Delegate } = require('ascesis/delegate');
const { Router } = require('ascesis/router');
const { getStories } = require('./story');
const Channel = require('./channel');
const AddonsApi = require('./addons');

const storiesTreeTemplate = require('../templates/stories_tree.html');
const addonsPanelTemplate = require('../templates/addons_panel.html');


class ManagerApp extends HTMLElement {

  connectedCallback(){

    const stories = getStories();
    const router = new Router({ useHash: true });

    this.$previewFrame = this.querySelector('#preview-frame');
    this.$fullscreenAnchor = this.querySelector('#fullscreen-anchor');

    const channel = new Channel(this.$previewFrame.contentWindow);
    AddonsApi.setChannel(channel);

    Split(['.left-panel', '.right-panel'], {
      sizes: [20, 80],
      gutterSize: 8,
      cursor: 'col-resize'
    });

    Split(['#preview-block', '#info-block'], {
      direction: 'vertical',
      sizes: [75, 25],
      gutterSize: 8,
      cursor: 'row-resize'
    });

    this.querySelector('#stories-tree').innerHTML = storiesTreeTemplate({ stories });

    router.add('/:story/:substory', (story, substory) => {
      const url = `/preview.html#${story}/${substory}`;

      this.$previewFrame.src = url;
      this.$fullscreenAnchor.href = url;
    });

    router.add('/:story', (story) => {
      //redirect to first substory path
      console.log(`story ${story}`);
    });

    router.add('/', () => {
      //redirect to first story path
      console.log('root route');
    });

    router.resolve();

  }
}

customElements.define('sandbox-manager-application', ManagerApp);


class AddonsPanel extends HTMLElement {
  connectedCallback(){
    this.innerHTML = addonsPanelTemplate({ panels: AddonsApi.getPanels() });
  }
}

customElements.define('sandbox-addons-panel', AddonsPanel);
