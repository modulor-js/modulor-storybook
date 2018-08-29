# modulor-storybook

Test your Componennts (All kinds of! 😎) with less hassle

## Installation

```
npm i -S modulor-storybook
```

## Use

- Define Component
- Define Story for component
- Run storybook

lets create `Button` component and its story

### Define Component

```js
// file: a-button/a-button.js
class Button extends HTMLElement {
  connectedCallback() {
    const type = this.getAttribute('type') || 'button';
    const disabled = this.hasAttribute('disabled') ? 'disabled' : '';
    const text = this.innerHTML;
    this.innerHTML = `<button type='${type}' ${disabled}>${text}</button>`;
  }
}

customElements.define('a-button', Button);
```

### Define Story for Component

By default, storybook it will pickup all files ending with `.story.js`
```js
// file: a-button/a-button.story.js
import { storiesOf } from 'modulor-storybook';

require('./a-button');

storiesOf('Button')
  .add('default', () => `<a-button>Button</a-button>`)
  .add('type=reset', () => `<form>
      <p>First Name: <input type="text" name="firstName"></p>
      <a-button type="reset">Reset</a-button>
    </form>`)
  .add('type=submit disabled', () => `<form>
      <p>First Name: <input type="text" name="firstName"></p>
      <a-button type="submit" disabled>Reset</a-button>
    </form>`);
  // or create story markup at runtime and add to container
  .add('as-function', () => (container) => {
    const element = document.createElement('a-button');
    element.addEventListener('click', console.log);
    container.appendChild(element);
  })
```

### Run storybook

You need to add npm script in your `package.json` in following way:
```js
  ...,
  "scripts": {
    ...,
    "storybook": "modulor-storybook"
  },
  ...
```

Now from your project root, you can fire up the npm script to run storybook:

```sh
npm run storybook
```

Now open [http://localhost:3000](http://localhost:3000) on browser to see the storybook.

Storybook will watch the files and keep recompiling. You ject need to reload in the browser.

By default storybook runs on the port `3000` but you can change it by `-p` option in following ways:

- change default port to `3333`
  ```js
    ...,
    "scripts": {
      ...,
      "storybook": "modulor-storybook -p 3333"
    },
    ...
  ```
- change port on each execution
  ```
  npm run storybook -- -p 3333
  ```

## Configuration

The home of storybook configuration is `.storybook` directory in parallel to your project's `package.json`

In `.storybook`, main config files are
- `config.js`
- `additional.js`
- `webpack.config.js`
- `middlewares.js`

### `config.js`

This file has main config options like glob patter for the stories to grab
```js
module.exports = {
  stories: '**/stories/*.story.js'
}
```

### `additional.js`

Additional JS for the storybook, like polyfills
```js
console.log('Additional JS');
//Polyfills and additional (required) JS & modules
require('babel-polyfill');
```

### `webpack.config.js`

Configure the additional webpack compilation like different css than project's webpack, additional transpiling options etc.
```js
module.exports = {
  module:{
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            minimize: true,
          },
        }, 'sass-loader'],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0'],
            plugins: ['transform-object-rest-spread']
          },
        },
      },
    ],
  }
}
```

### `middlewares.js`

**EXPERIMENTAL FEATURE**

Configure storybook express server middlewares. This file should be a valid js module with export of:


express middleware ([more about express middlewares](http://expressjs.com/en/guide/using-middleware.html)):
```js
module.exports = (req, res, next) => { ... };
```

array of express middlewares:
```js
module.exports = [
  (req, res, next) => { ... },
  (req, res, next) => { ... }
]
```

array of tuples `[route, middleware]`:
```js
module.exports = [
  ['/foo', (req, res, next) => { ... }],
  ['/bar', (req, res, next) => { ... }]
]
```

mixed array:
```js
module.exports = [
  (req, res, next) => { ... },
  ['/baz', (req, res, next) => { ... }]
]
```


#### Use cases

- Mock ajax calls
- Redirect ajax calls to another endpoint
- Base authorisation
- etc


### `favicon.ico`

Custom project icon

----

## Addons

Addons will provide a way to customize storybook

You can build your addons to make storybook fit yor needs. Your can go throught the [Addons API](./addons/README.md) to start creat your own Addons.

----

## Generate Static files of Storybook

Add following script to your `package.json`

```js
"docs": "build-storybook"
```
and when you nus it as `npm run docs`; it will generate the static file in directory `.storybook/dis`

If you want to generate those files in other directory than default one; you can use `-o` or `--output` parameter; like following:

```js
"docs": "build-storybook --output='./docs'"
```
----

## Facing Problems?

Please raise an issue.
