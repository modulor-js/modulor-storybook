module.exports = (scope) => `
    <div id="container"></div>
    ${scope.assets.filter(path => path.endsWith('.js'))
                  .map(path => `<script src="/${path}"></script>`)
                  .join('\n')
    }
`;
