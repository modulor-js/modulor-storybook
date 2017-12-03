const template = require('./stories-branding.html');

const name = 'storybook-branding';
const HIDDEN = 'hidden';

class Branding extends HTMLElement {
  connectedCallback() {
    this.brand = this.getAttribute('name') || 'Storybook';
    this.render();
    this.refs = {
      actions: this.querySelector('.actions'),
      filterForm: this.querySelector('[ref=filterForm]'),
    };
    this.addEventListener('click', (e) => {
      const el = e.target;
      this.act(el.getAttribute('ref'));
    });
  }
  act(action) {
    switch (action) {
      case 'toggle':
        this.toggle('actions');
        break;
      case 'mobile':
        this.events.mobile(!this.events.isMobile());
        this.act('toggle');
        break;
      case 'tree':
        this.events.tree();
        this.act('toggle');
        break;
      case 'filter':
      case 'filterClose':
        this.toggle('filterForm');
        break;
      default: {
        console.log('None');
      }
    }
  }
  setEvents(eventsObj) {
    this.events = eventsObj;
  }
  toggle(ref) {
    this.refs[ref].classList[this.refs[ref].classList.contains(HIDDEN) ? 'remove' : 'add'](HIDDEN);
  }
  render() {
    this.innerHTML = template({ name, brand: this.brand });
  }
}

customElements.define(name, Branding);
