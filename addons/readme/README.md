# usage

```js
const README = require('./README.md');

//readme for certain storykind
storiesOf('mystory')
  .add('mystorykind', withReadme(README, () => `
    //render storykind
  `));


//common readme for all storykinds using decorator
storiesOf('mystory')
  .addDecorator(withReadme(README))
  .add('mystorykind', () => `
    //render storykind
  `);
```


## common readme + certain readme for certain storykind:

```js
const README = require('./README.md');
const STORY_README = require('./STORY_README.md');

storiesOf('mystory')
  .addDecorator(withReadme(README))
  .add('mystorykind', () => `
    //render storykind
  `)
  .add('mystorykind 2', withReadme(STORY_README, () => `
    //render storykind
  `));
```


