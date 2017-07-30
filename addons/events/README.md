# usage

```js
//events for certain storykind
storiesOf('mystory')
  .add('mystorykind', withEvents(['click'], () => `
    //render storykind
  `));


//common events for all storykinds using decorator
storiesOf('mystory')
  .addDecorator(withEvents(['click'])
  .add('mystorykind', () => `
    //render storykind
  `);
```

