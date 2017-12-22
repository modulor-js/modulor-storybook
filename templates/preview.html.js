const css = require('../components/sandbox-preview/sandbox-preview.css');

module.exports = scope => `
${css({})}

<sandbox-preview-application id="container"></sandbox-preview-application>
${
  scope.assets
    .filter(path => path.endsWith('.js'))
    .map(path => `<script src="${path}"></script>`)
    .join('\n')
}
`;
