import { storiesOf } from '../../js/story';

require('./stories-tree');

const stories = `
{"stories - tree":{"storyName":"stories - tree","stories":{"default ":{}},"decorators":[]},"Test":{"storyName":"Test","stories":{"hello":{}},"decorators":[]}}
`;

storiesOf('stories-tree')
  .add('default', (stories) => '<stories-tree></stories-tree>');
