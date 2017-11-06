const { fireEvent } = require('modulor');
const { delegate } = require('modulor/delegate');
const storiesTreeTemplate = require('./stories-tree.html');


class StoriesTree extends HTMLElement {
  connectedCallback() {
    delegate.on('change', this, 'li[story-kind]', (event, target) => {
      event.$storyKindEl = target;
    });

    delegate.on('change', this, 'li[story]', (event, target) => {
      const story = target.getAttribute('story');
      let $storyKindEl = event.$storyKindEl;
      if (!$storyKindEl) {
        $storyKindEl = target.querySelector(
          `li[story-kind]`
        );
        $storyKindEl.querySelector('input[story-kind]').checked = true;
      }
      const storyKind = $storyKindEl.getAttribute('story-kind');

      fireEvent('story-changed', this, { story, storyKind });
    });
  }

  render(stories) {
    this.innerHTML = storiesTreeTemplate({ stories });
  }

  setActive(story, storyKind) {
    (this.querySelector(`input[story="${story}"]`) || {}).checked = true;
    (this.querySelector(
      `li[story="${story}"] input[story-kind="${storyKind}"]`
    ) || {}).checked = true;
  }

  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
    this.render(value);
  }
}

customElements.define('stories-tree', StoriesTree);
