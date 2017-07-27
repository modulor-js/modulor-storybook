const AddonsApi = require("ascesis-storybook/addons");
const style = `
  <style>
  .logger-event-btn {
    background-color: white;
    border-radius: 5px;
    border: 1px solid #219BC6;
    color: #219BC6;
    display: inline-block;
    font-family: "Bariol", "Open Sans", sans-serif;
    font-size: 12px;
    font-weight: 700;
    height: 30px;
    line-height: 30px;
    margin-right: 5px;
    padding-left: 20px;
    padding-right: 20px;
    text-transform: uppercase;
    transition: all 0.25s;
  }
  .logger-event-btn.fired {
    background-color: #1DB1E5;
    border: 1px solid #1DB1E5;
    color: white;
  }
  </style>
`;

//define manager plugin
customElements.define(
  "events-manager",
  class extends HTMLElement {
    connectedCallback() {
      AddonsApi.getChannel().on("events-plugin-events-list", events => {
        if (this.innerHTML.length) {
          return false;
        }

        const eventsCode = events
          .map(
            event => `
            <span id="${event}" class="logger-event-btn">${event}</span>
          `)
          .reduce((code, line) => (code += line), "");

        this.innerHTML = style + eventsCode;
      });

      AddonsApi.getChannel().on("event-fired", event => {
        this.addClassFor(document.querySelector(`#${event}`), "fired", 250);
      });
    }

    addClassFor(el, className, duration) {
      el.classList.add(className);
      setTimeout(() => {
        el.classList.remove(className);
      }, duration);
    }
  }
);
AddonsApi.addPanel("Events", () => `<events-manager></events-manager>`);

//define preview plugin
customElements.define(
  "events-preview",
  class extends HTMLElement {
    connectedCallback() {
      let events = this.getAttribute("events").split(",");

      AddonsApi.getChannel().emit("events-plugin-events-list", events);
      this.setEventsListener(events);
    }

    setEventsListener(events) {
      events.forEach(event => this.addEventListener(event, handleEvent, false));

      function handleEvent(evt) {
        AddonsApi.getChannel().emit("event-fired", evt.type);
      }
    }
  }
);
