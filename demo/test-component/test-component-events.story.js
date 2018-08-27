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
  .add('hello', () => '<test-component>hello world for events plugin</test-component>')
  .add('as-function', () => (container) => {
    container.textContent = 'Check the JS console';
    const element = document.createElement('test-component');
    element.addEventListener('change', (e) => {
      console.log('From the story function', e);
    });
    container.appendChild(element);
  });

