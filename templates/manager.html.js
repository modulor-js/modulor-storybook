module.exports = (scope) => `

  <sandbox-manager-application></sandbox-manager-application>

  ${scope.assets.filter(path => path.endsWith('.js'))
                .map(path => `<script src="/${path}"></script>`)
                .join('\n')
  }
`;
