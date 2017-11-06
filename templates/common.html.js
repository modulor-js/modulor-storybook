const config = require('../config');

module.exports = scope => `
    <html>
      <head>
        <link rel="icon" href="${config.stories.branding.icon.url}" type="${config.stories.branding.icon.type}" />
        ${scope.headContent}
      </head>
      <body style="margin:0">
        ${scope.bodyContent}
      </body>
    </html>
`;
