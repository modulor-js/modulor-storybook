import { storiesOf } from '../../js/story';
import { withEvents } from '../../addons/events';

require('./test-component');

storiesOf('Test Events')
  .addDecorator(withEvents([
    'click',
    {
      type: 'change',
      extract: ['timeStamp', 'target.value'],
    },
  ]))
  .add('hello', () =>
    `<test-component>
      hello world for events plugin
    </test-component>`)
