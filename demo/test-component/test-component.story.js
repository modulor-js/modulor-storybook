import { storiesOf } from '../../js/story';

require('./test-component');

storiesOf('Test')
  .add('hello', () =>
    `<test-component>
      hello world
    </test-component>`)
