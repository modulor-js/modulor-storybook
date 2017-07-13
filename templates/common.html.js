module.exports = (scope) => `
    <html>
      <head>
        ${scope.headContent}
      </head>
      <body>
        ${scope.bodyContent}
      </body>
    </html>
`;
