module.exports = scope => `
    <html>
      <head>
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        ${scope.headContent}
      </head>
      <body style="margin:0">
        ${scope.bodyContent}
      </body>
    </html>
`;
