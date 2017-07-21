module.exports = (scope) => `
    <style>
      * {
        box-sizing: border-box;
      }

      body: {
        margin: 0;
      }

      sandbox-preview-application {
        display: block;
        width: 100%;
        height: 100%;
      }
    </style>

    <sandbox-preview-application id="container"></sandbox-preview-application>
    ${scope.assets.filter(path => path.endsWith('.js'))
                  .map(path => `<script src="/${path}"></script>`)
                  .join('\n')
    }
`;
