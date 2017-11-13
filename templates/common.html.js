const config = require('../config');

module.exports = scope => `
    <html>
      <head>
        <link rel="icon" type="${config.stories.branding.icon.type}" href="${config.stories.branding.icon.url}" />
        ${scope.headContent}
      </head>
      <body style="margin:0">
        ${scope.bodyContent}
      </body>
    </html>
`;
