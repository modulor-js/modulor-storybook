module.exports = (scope) => `
    <iframe src="/preview.html"></iframe>
    <div id="root"></div>
    ${scope.assets.filter(path => path.endsWith('.js'))
                  .map(path => `<script src="${path}"></script>`)
                  .join('\n')
    }
`;
