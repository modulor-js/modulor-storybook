# ascesis-storybook
Work in progress

## Plugins api

### Usage

```js
const AddonsApi = require('ascesis-storybook/js/addons');

//define manager plugin
customElements.define('your-custom-tag', class extends HTMLElement {
  connectedCallback(){
    //do the job
  }
});
AddonsApi.addPanel('<panel name>', () => `<your-custom-tag></your-custom-tag>`);

//define preview plugin
customElements.define('your-custom-tag', class extends HTMLElement {
  connectedCallback(){
    //do the job
  }
});
```

### Plugins API
[check implementation](./js/addons.js)
