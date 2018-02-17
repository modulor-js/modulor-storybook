const AddonsApi = require("modulor-storybook/addons");
const { fireEvent, html } = require("modulor");
const Modulor = require('modulor/dom_utils');


const ROUTE_CONTROL_SELECTOR = `[ref="route-input"]`;

const HISTORY_BACK_BUTTON_SELECTOR = `[ref="history-back-button"]`;
const HISTORY_FORWARD_BUTTON_SELECTOR = `[ref="history-forward-button"]`;
const REFRESH_BUTTON_SELECTOR = `[ref="refresh-button"]`;

const ROUTE_UPDATE = 'update-route';
const ROUTES_LIST_UPDATE = 'update-routes-list';

const UPDATE_ANIMATION_DURATION = 300;

const template = (scope) => `
  <style>

    route-preview {
      display: block;
      transition: opacity ${scope.animationDuration}ms ease-in;
    }
    route-preview.blink {
      opacity: 0.4;
    }

    .router-plugin-form-wrapper {
      display: table;
      width: 100%;
      margin: 0;
      padding: 5px;
      background: #eee;
    }

    .router-plugin-form-navigation, .router-plugin-form {
      display: table-cell;
    }
    .router-plugin-form-navigation {
      width: 115px;
    }

    .router-plugin-form-button {
      background: none;
      border: none;
      padding: 5px;
      border-radius: 1px;
      cursor: pointer;
    }
    .router-plugin-form-button:hover {
      background: #ccc;
    }
    .router-plugin-form-button:focus {
      outline: none;
    }

    .router-plugin-form-input {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 2px;
      font-size: 12px;
      padding: 5px;
    }
    .router-plugin-form-input:focus {
      outline: none;
      border-color: #8ab8e7;
    }
  </style>
  <div class="router-plugin-form-wrapper">
    <div class="router-plugin-form-navigation">
      <button title="History back" class="router-plugin-form-button" ref="history-back-button">←</button>
      <button title="History forward" class="router-plugin-form-button" ref="history-forward-button">→</button>
      <button title="Restore default url" class="router-plugin-form-button" ref="refresh-button">↺</button>
      <button title="Navigate" class="router-plugin-form-button" type="submit" form="router-plugin-form">GO</button>
    </div>
    <form class="router-plugin-form" id="router-plugin-form" ref="route-form">
      <input placeholder="Route" class="router-plugin-form-input" ref="route-input"/>
    </form>
  </div>
`;


class RoutePreview extends HTMLElement {
  connectedCallback() {

    const route = this.getAttribute('route') || '/';

    this.channel = AddonsApi.getChannel();

    this.channel.emit(ROUTES_LIST_UPDATE, route);

    this.channel.on(ROUTE_UPDATE, this.updateRoute.bind(this));

    this.insertBefore(html(template(
      { route, animationDuration: UPDATE_ANIMATION_DURATION }
    )), this.firstChild);

    this.$form = this.querySelector('[ref="route-form"]');
    this.$input = this.querySelector(ROUTE_CONTROL_SELECTOR);
    this.$historyBack = this.querySelector(HISTORY_BACK_BUTTON_SELECTOR);
    this.$historyForward = this.querySelector(HISTORY_FORWARD_BUTTON_SELECTOR);
    this.$refresh = this.querySelector(REFRESH_BUTTON_SELECTOR);

    this.$historyBack.addEventListener('click', event => {
      window.history.back();
      event.preventDefault();
    });

    this.$historyForward.addEventListener('click', event => {
      window.history.forward();
      event.preventDefault();
    });

    const initialPath = this.locationPath;
    this.$refresh.addEventListener('click', event => {
      window.location.href = initialPath;
    });

    this.$input.addEventListener('click', () => {
      this.$input.setSelectionRange(0, this.$input.value.length)
    });

    this.$form.addEventListener('submit', event => {
      this.updateRoute(this.$input.value);
      event.preventDefault();
    });

    window.addEventListener('popstate', () => {
      this.$input.value = this.locationPath;
      this.classList.add('blink');
      setTimeout(() => {
        this.classList.remove('blink');
      }, UPDATE_ANIMATION_DURATION);
    });

    setTimeout(() => {
      this.updateRoute(route);
    }, 100);
  }

  get locationPath(){
    return window.location.href.replace(window.location.origin, '');
  }

  updateRoute(route){
    window.history.pushState(null, null, route);
    fireEvent('popstate', window);
  }
}

customElements.define("route-preview", RoutePreview);


const withRoute = (route, render) => (story) => {
  const $element = document.createElement('route-preview');
  $element.setAttribute('route', route);
  Modulor.html($element, render ? render() : story());
  return $element;
};

module.exports = { withRoute };


