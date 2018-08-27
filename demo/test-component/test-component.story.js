import { storiesOf } from '../../js/story';

require('./test-component');

storiesOf('Test')
  .add('hello', () => '<test-component>hello world</test-component>')
  .add('as-function', () => (container) => {
    container.textContent = 'Check the JS console';
    const element = document.createElement('test-component');
    element.addEventListener('change', console.log);
    container.appendChild(element);
  });
