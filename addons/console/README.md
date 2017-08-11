# usage

```js
const {withConsole} = require('ascesis-storybook/addons/console');

// console mocking for certain storykind
storiesOf('mystory')
  .add('mystorykind', withConsole(() => `
    //render storykind
  `));


// console mocking for all storykinds using decorator
storiesOf('mystory')
  .addDecorator(withConsole())
  .add('mystorykind', () => `
    //render storykind
  `);
```

