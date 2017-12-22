const AddonsApi = require('modulor-storybook/addons');
const dateFormat = require('dateformat');

const stylesTemplate = scope => `
  <style>
  .logger-event-btn {
    background-color: white;
    border-radius: 5px;
    border: 1px solid ${scope.color};
    color: ${scope.color};
    display: inline-block;
    font-family: "Open Sans", sans-serif;
    font-size: 12px;
    font-weight: 700;
    height: 30px;
    line-height: 30px;
    margin-right: 5px;
    padding-left: 20px;
    padding-right: 20px;
    transition: all ${scope.duration}ms;
  }
  .logger-event-btn.fired {
    background-color: ${scope.animatedStateColor};
    border: 1px solid ${scope.animatedStateColor};
    color: white;
  }
  #events-data {
    list-style: none;
    padding: 0;
    display: table;
  }
  #events-data li {
    display: table-row;
  }
  #events-data .info{
    padding: 5px;
    display: table-cell;
    font-family:Inconsolata, Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;
  }
  #events-data .info .label{
    color: #999;
  }
  #events-data .info .label:after{
    /* (Un)comment following line to show/hide a colon after the grey label */
    /* content: ':'; */
  }
  #events-data .info .value{
    color: #555;
  }
  #events-data .info.info-event .value{
    color: purple;
  }
  #events-data .info.info-data .value{
    color: #219bc6;
  }
  </style>
`;

const EVENT_FIRED = 'event-fired';
const EVENTS_LIST_UPDATE = 'events-plugin-events-list';
const DATE_FORMAT = 'yyyy-mm-dd HH:MM:ss:l';
const COLOR = '#219BC6';
const ANIMATION_DURATION = 250;
const ANIMATED_STATE_COLOR = '#1DB1E5';

const dataTemplate = scope => `
<span class="info ${scope.className || ''}">
  ${scope.label ? `<span class="label">${scope.label}</span>` : ''}
  <span class="value">${scope.value}</span>
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
      const eventsCode = events.map((event) => {
        const eventName = typeof event === 'string' ? event : event.type;
        return `<span id="${eventName}" class="logger-event-btn">${eventName}</span>`;
      }).join('');
      const list = '<ul id="events-data"></ul>';
      this.innerHTML = styles + eventsCode + list;
      this.list = this.querySelector('#events-data');
    });

    this.channel.on(EVENT_FIRED, (event) => {
      this.addClassFor(document.querySelector(`#${event.type}`), 'fired', ANIMATION_DURATION);
      if (event.data) {
        const li = document.createElement('li');
        li.innerHTML = [
          { label: dateFormat(+new Date, DATE_FORMAT), value: event.type, className: 'info-event' },
          { label: '', value: JSON.stringify(event.data), className: 'info-data' },
        ].map(dataTemplate).join('');
        this.list.insertBefore(li, this.list.firstElementChild);
      }
    });

    AddonsApi.onStory(this.empty.bind(this));
  }

  empty() {
    this.innerHTML = '';
  }

  addClassFor(el, className, duration) {
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
            const subkeys = key.split('.')
            acc[key] = subkeys.length > 1 ? subkeys.reduce((acc, k) => acc[k], e) : e[key];
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


const withEvents = (events, render) => story => `
  <events-preview events='${JSON.stringify(events)}'>
    ${(render || story)()}
  </events-preview>
`;


module.exports = {
  withEvents,
};
