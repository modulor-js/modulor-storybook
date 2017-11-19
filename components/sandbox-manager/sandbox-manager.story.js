import { storiesOf } from '../../js/story';

storiesOf('Sandbox manager (fractal)')
  .add(`ok`, () => {
    require('./sandbox-manager');
    return `
      <b>ok, close it, it takes cpu</b>
      <sandbox-manager-application></sandbox-manager-application>
    `
  })

