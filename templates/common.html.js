module.exports = scope => `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        ${scope.headContent}
      </head>
      <body style="margin:0">
        ${scope.bodyContent}
      </body>
    </html>
`;
