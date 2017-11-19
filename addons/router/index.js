const AddonsApi = require("modulor-storybook/addons");


const ROUTE_CONTROL_SELECTOR = `[ref="route-input"]`;

const ROUTE_UPDATE = 'update-route';
const ROUTES_LIST_UPDATE = 'update-routes-list';

const template = (scope) => `
  ${scope ? `
    <form ref="route-form">
      ${scope.routes.length > 1 ? `
        <select ref="route-input">
          ${scope.routes.map(route => `
            <option value="${route}">${route}</option>
          `)}
        </select>
      ` : `
        <input placeholder="Route" ref="route-input"/>
      `}
      <button type="submit">update</button>
    </form>
  ` : `
    <span>Loading</span>
  `}
`;

class RouteManager extends HTMLElement {
  connectedCallback() {

    this.innerHTML = template();

    this.channel = AddonsApi.getChannel();

    this.channel.on(ROUTES_LIST_UPDATE, this.init.bind(this));

    AddonsApi.onStory(() => {
      this.innerHTML = template();
    });
  }

  init(routes){
    this.innerHTML = template({ routes });

    this.$form = this.querySelector('[ref="route-form"]');
    this.$input = this.querySelector(ROUTE_CONTROL_SELECTOR);

    this.$form.addEventListener('submit', (event) => {
      this.channel.emit(ROUTE_UPDATE, this.$input.value);
      event.preventDefault();
    });

    this.value = routes[0];
  }

  get value(){
    (this.$input || {value: ''}).value;
  }

  set value(val){
    (this.$input || {value: ''}).value = val;
  }
}

customElements.define("route-manager", RouteManager);
AddonsApi.addPanel("Route", () => `<route-manager></route-manager>`);



class RoutePreview extends HTMLElement {
  connectedCallback() {
      console.log(window.location);

    const routes = (this.getAttribute('routes') || '/').split(',');

    this.channel = AddonsApi.getChannel();

    this.channel.on(ROUTE_UPDATE, route => {
      console.log(89999, route);
    });

    this.channel.emit(ROUTES_LIST_UPDATE, routes);
  }
}

customElements.define( "route-preview", RoutePreview);


const withRoutes = (routes, render) => (story) => `
  <route-preview routes="${routes.join(',')}">
    ${(render || story)()}
  </route-preview>
`;

module.exports = { withRoutes };


