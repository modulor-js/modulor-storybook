# usage

```js
//events for certain storykind
storiesOf('mystory')
  .add('mystorykind', withMock({
    //simple mock
    '/foo/bar/*': { foo: 123 },

    //function
    '/foo/bar/*': (url, opts) => {
      return { bar: 123 };
    },

    //with parameters
    '/foo/bar/*': {
      mock: { bla: 'test' },
      options: { delay: 1000 }
    },

    //scenarios
    '/foo/bar/*': [{
      mock: { bla: 'test' },
      options: { delay: 1000, times: 2 }
    }, {
      mock: { bla: 'bar' },
      options: { delay: 2000 }
    }],
  }, () => `
    //render storykind
  `));


//common events for all storykinds using decorator
storiesOf('mystory')
  .addDecorator(withMock({ ... mock config (see above)... }))
  .add('mystorykind', () => `
    //render storykind
  `);
```

