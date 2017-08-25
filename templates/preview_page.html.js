const commonTemplate = require('./common.html');
const previewTemplate = require('./preview.html');

module.exports = (scope) => commonTemplate({
  headContent: `
    <title>Story preview</title>
    ${scope.header || ''}
  `,
  bodyContent: previewTemplate({
    assets: scope.assets
  })
})
