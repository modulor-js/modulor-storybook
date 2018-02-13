const { fireEvent } = require('modulor');
const { delegate } = require('modulor/delegate');
const storiesTreeTemplate = require('./stories-tree.html');

const PLACEHOLDER = 'Filter';
const HIDE_CLASS = 'hide-story';

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
          'li[story-kind]',
        );
        $storyKindEl.querySelector('input[story-kind]').checked = true;
      }
      const storyKind = $storyKindEl.getAttribute('story-kind');

      fireEvent('story-changed', this, { story, storyKind });
    });

    delegate.on('keyup', this, '[ref="filter-input"]', (event, { value }) => {
      const targetValue = value.toLowerCase();

      this.$refs.storyList.forEach((story) => {
        if (!~story.getAttribute('story').toLowerCase().indexOf(targetValue)) {
          story.classList.add(HIDE_CLASS);
        } else {
          story.classList.remove(HIDE_CLASS);
        }
      });
    });
  }

  render(stories) {
    stories = this.sortStoriesKeys(stories);
    this.innerHTML = storiesTreeTemplate({ stories, placeholder: PLACEHOLDER });

    this.$refs = {
      storyList: this.querySelectorAll('[ref="story-list"] > li'),
    };
  }

  setActive(story, storyKind) {
    (this.querySelector(`input[story="${story}"]`) || {}).checked = true;
    (this.querySelector(
      `li[story="${story}"] input[story-kind="${storyKind}"]`,
    ) || {}).checked = true;
  }

  sortStoriesKeys(stories) {
    return Object.keys(stories).sort().reduce((acc, key) => {
      acc[key] = stories[key];
      return acc;
    }, {});
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
