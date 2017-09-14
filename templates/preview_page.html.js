const commonTemplate = require('./common.html');
const previewTemplate = require('./preview.html');

module.exports = scope => commonTemplate({
  headContent: `
    <title>Story preview</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    ${scope.header || ''}
  `,
  bodyContent: previewTemplate({
    assets: scope.assets,
  }),
});
