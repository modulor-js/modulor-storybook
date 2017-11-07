# Addons API

## Usage

```js
const AddonsApi = require('modulor-storybook/addons');

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

## Addons API
[check implementation](./js/addons.js)


## Examples

[README plugin](./addons/readme)

