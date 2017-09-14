const favicon = require('./favicon');

module.exports = scope => `
    <html>
      <head>
        <link rel="icon" href="${favicon}" type="image/svg+xml" />
        ${scope.headContent}
      </head>
      <body style="margin:0">
        ${scope.bodyContent}
      </body>
    </html>
`;
