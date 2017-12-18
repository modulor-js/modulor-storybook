const AddonsApi = require("modulor-storybook/addons");

const stylesTemplate = (scope) => `
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
  }
  #events-data .info .label{
    color: #ccc;
  }
  #events-data .info .label:after{
    content: ':';
  }
  #events-data .info .value{
    color: #555;
  }
  </style>
`;

const EVENT_FIRED = 'event-fired';
const EVENTS_LIST_UPDATE = 'events-plugin-events-list';

const ANIMATION_DURATION = 250;
const COLOR = '#219BC6';
const ANIMATED_STATE_COLOR = '#1DB1E5';

const dataTemplate = (scope) => `
<span class="info">
  <span class="label">${scope.label}</span>
  <span class="value">${scope.value}</span>
</span>
`;
//define manager plugin
class EventsManager extends HTMLElement {
  connectedCallback() {
    this.channel = AddonsApi.getChannel();

    const styles = stylesTemplate({
      duration: ANIMATION_DURATION,
      color: COLOR,
      animatedStateColor: ANIMATED_STATE_COLOR
    });

    this.channel.on(EVENTS_LIST_UPDATE, events => {

      const eventsCode = events
        .map(
        event => `
          <span id="${event}" class="logger-event-btn">${event}</span>
        `).join('');
      const list = '<ul id="events-data"></ul>';
      this.innerHTML = styles + eventsCode + list;
      this.list = this.querySelector('#events-data');
    });

    this.channel.on(EVENT_FIRED, event => {
      this.addClassFor(document.querySelector(`#${event.type}`), "fired", ANIMATION_DURATION);
      const li = document.createElement('li');
      const info = [];
      info.push({ label: +new Date, value: event.type });
      info.push({ label: 'Data', value: event.data })
      li.innerHTML = info.map(dataTemplate).join('')
      this.list.insertBefore(li, this.list.firstElementChild);
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

customElements.define("events-manager", EventsManager);
AddonsApi.addPanel("Events", () => `<events-manager></events-manager>`);


//define preview plugin

class EventsPreview extends HTMLElement {
  connectedCallback() {
    const events = this.getAttribute("events").split(",");

    this.channel = AddonsApi.getChannel();

    this.channel.emit(EVENTS_LIST_UPDATE, events);

    events.forEach(eventName => this.addEventListener(eventName, e => {
      console.log(e);
      this.channel.emit(EVENT_FIRED, {
        type: e.type,
        data: e.data || e.value || e.target.value
      });
    }));
  }
}

customElements.define("events-preview", EventsPreview);


const withEvents = (events, render) => (story) => `
  <events-preview events='${events.join(',')}'>
    ${(render || story)()}
  </events-preview>
`;


module.exports = {
  withEvents
}
