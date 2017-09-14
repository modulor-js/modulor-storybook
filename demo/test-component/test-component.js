class Component extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log('Test Component Mounted');
    this.innerHTML = '<h1>Hello World</h1>';
  }
}
customElements.define('test-component', Component);
