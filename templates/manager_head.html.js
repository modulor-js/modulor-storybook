const config = require('../config');

module.exports = () => `
  <title>${config.stories.branding.name}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css">
  <style>
    html, body {
      height: 100%;
    }

    body {
      padding: 8px;
      background-color: #F6F6F6;
      box-sizing: border-box;
    }
  </style>
`;
