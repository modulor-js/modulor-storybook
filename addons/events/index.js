const AddonsApi = require('../../addons');
const dateFormat = require('dateformat');
const stylesTemplate = require('./style.css').default;
require('inspector-component/src/index.js');


const EVENT_FIRED = 'event-fired';
const EVENTS_LIST_UPDATE = 'events-plugin-events-list';
const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss:l';
const COLOR = '#219BC6';
const ANIMATION_DURATION = 250;
const ANIMATED_STATE_COLOR = '#1DB1E5';

const dataTemplate = scope => `
<span class="info ${scope.className || ''}">
  ${scope.label ? `<span class="label">${scope.label}</span>` : ''}
  <span class="value">${scope.logger ? `<inspector-component data='${scope.value}'></inspector-component>` : scope.value}</span>
</span>
`;

// define manager plugin
class EventsManager extends HTMLElement {
  connectedCallback() {
    this.channel = AddonsApi.getChannel();

    const styles = stylesTemplate({
      color: COLOR,
      duration: ANIMATION_DURATION,
      animatedStateColor: ANIMATED_STATE_COLOR,
    });

    this.channel.on(EVENTS_LIST_UPDATE, (events) => {
      const clear = '<button id="clear-log" class="logger-event-btn clear-button" type="button">Clear</button>';
      const eventsCode = events.map((event) => {
        const eventName = typeof event === 'string' ? event : event.type;
        return `<span id="${eventName}" class="logger-event-btn">${eventName}</span>`;
      }).join('');
      const list = '<ul id="events-data"></ul>';
      this.innerHTML = clear + styles + eventsCode + list;
      this.list = this.querySelector('#events-data');
    });
    this.addEventListener('click', (e) => {
      if (e.target.matches('#clear-log')) {
        this.list.innerHTML = '';
      }
    });
    this.channel.on(EVENT_FIRED, (event) => {
      this.addClassFor(document.querySelector(`#${event.type}`), 'fired', ANIMATION_DURATION);
      if (event.data) {
        const li = document.createElement('li');
        li.innerHTML = [
          {
            value: event.type,
            className: 'info-event',
            label: dateFormat(+new Date, DATE_FORMAT),
          },
          {
            label: '',
            logger: true,
            className: 'info-data',
            value: JSON.stringify(event.data),
          },
        ].map(dataTemplate).join('');
        this.list.insertBefore(li, this.list.firstElementChild);
      }
    });

    AddonsApi.onStory(this.empty.bind(this));
  }

  empty() {
    this.innerHTML = '';
  }

  addClassFor(el = this, className, duration) {
    el.classList.add(className);
    setTimeout(() => {
      el.classList.remove(className);
    }, duration);
  }
}

customElements.define('events-manager', EventsManager);
AddonsApi.addPanel('Events', () => '<events-manager></events-manager>');


// define preview plugin

class EventsPreview extends HTMLElement {
  connectedCallback() {
    const events = JSON.parse(this.getAttribute('events'));

    this.channel = AddonsApi.getChannel();

    this.channel.emit(EVENTS_LIST_UPDATE, events);

    events.forEach((event) => {
      const eventName = typeof event === 'string' ? event : event.type;
      this.addEventListener(eventName, (e) => {
        const eventData = {
          type: e.type,
        };
        if (eventName !== event) {
          eventData.data = event.extract.reduce((acc, key) => {
            const subkeys = key.split('.');
            acc[key] = subkeys.length > 1 ? subkeys.reduce((ac, k) => ac[k], e) : e[key];
            return acc;
          }, {});
          // Log the event info to help in debugging
          console.log(eventData, e);
        }
        this.channel.emit(EVENT_FIRED, eventData);
      });
    });
  }
}

customElements.define('events-preview', EventsPreview);

const withEvents = (events, render) => story => {
  const storyContent = (render || story)();
  if(typeof storyContent === 'function'){
    const pluginContainer = document.createElement('events-preview');
    pluginContainer.setAttribute('events', JSON.stringify(events));

    return (container) => {
      storyContent(pluginContainer);
      container.appendChild(pluginContainer);
    };
  }
  return `
    <events-preview events='${JSON.stringify(events)}'>
      ${storyContent}
    </events-preview>
  `
};

module.exports = {
  withEvents,
};
