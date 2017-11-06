const template = scope => `
  <style>
    ${scope.name} {
      display: block;
      border-bottom: 1px solid #c0c0c0;
      background: #efefef;
    }
    .branding-container {
      padding: 5px;
      font-size: 2em;
    }
  </style>
  <div class="branding-container">${scope.brand}</div>
`;
const name = 'storybook-branding';
class Branding extends HTMLElement {
  connectedCallback() {
    this.brand = this.getAttribute('name') || 'Storybook';
    this.render();
  }

  render() {
    this.innerHTML = template({ name, brand: this.brand });
  }
}

customElements.define(name, Branding);
