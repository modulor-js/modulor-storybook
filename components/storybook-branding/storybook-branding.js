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
    .actions button,
    .actions input {
      border: 1px solid #ccc;
      border-radius: 2px;
      background: #dedede;
      font-size: 12px;
      padding: 5px 7px;
    }
    .actions button:focus,
    .actions button:active,
    .actions input:focus,
    .actions input:active {
      outline: 1px dotted #aaa;
      outline-offset: 0;
    }
    .actions .right {
      float: right;
    }
  </style>
  <div class="branding-container">${scope.brand}</div>
  <div class="actions">
    <span class="left">
      <button type="button" title="Mobile" ref="mobile">M</button>
      <button type="button" title="Tree" ref="tree">T</button>
      <button type="button" title="Addon" ref="addon">A</button>
    </span>
    <span class="right">
      <button type="button" title="Filter" ref="filter">F</button>
      <span class="hidden" ref="filterForm">
        <input type="text" ref="filterQuery" placeholder="Filter Query" />
        <button type="button" title="Apply Filter" ref="filterApply">Apply</button>
        <button type="button" title="Clear Filter" ref="filterClear">x</button>
        <button type="button" title="Close Filter" ref="filterClose">C</button>
      </span>
      <button type="button" title="Sort" ref="sort">S</button>
    </span>
  </div>
`;
const name = 'storybook-branding';
class Branding extends HTMLElement {
  connectedCallback() {
    this.brand = this.getAttribute('name') || 'Storybook';
    this.render();
    this.addEventListener('click', (e) => {
      const el = e.target;
      switch (el.getAttribute('ref')) {
        case 'filter':
          this.querySelector('[ref=filterForm]').classList.remove('hidden');
          el.classList.add('hidden');
          break;
        case 'filterClose':
          this.querySelector('[ref=filterForm]').classList.add('hidden');
          this.querySelector('[ref=filter]').classList.remove('hidden');
          break;
        default: {
          console.log('None');
        }
      }
    });
  }

  render() {
    this.innerHTML = template({ name, brand: this.brand });
  }
}

customElements.define(name, Branding);
