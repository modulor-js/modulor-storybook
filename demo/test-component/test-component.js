class Component extends HTMLElement {
  connectedCallback() {
    console.log('Test Component Mounted');
    const content = this.innerHTML;
    this.innerHTML = `<h1>Test Component</h1>
    <div>
      ${content}
      <br/>
      <input type="text" name="name" />
    </div>
    `;
  }
}
customElements.define('test-component', Component);
