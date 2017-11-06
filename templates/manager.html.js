module.exports = scope => `

  <sandbox-manager-application mobile branding='${JSON.stringify(scope.branding || {})}'></sandbox-manager-application>

  ${scope.assets
    .filter(path => path.endsWith('.js'))
    .map(path => `<script src="${path}"></script>`)
    .join('\n')
}
`;
