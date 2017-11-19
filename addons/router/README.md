# usage

```js

import { withRoute } from 'modulor-storybook/addons/router';

//route for certain storykind
storiesOf('mystory')
  .add('mystorykind', withRoute('/foo', () => `
    //render storykind
  `));


//common route for all storykinds using decorator
storiesOf('mystory')
  .addDecorator(withRoute('/bar'))
  .add('mystorykind', () => `
    //render storykind
  `);
```

