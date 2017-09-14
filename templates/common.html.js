module.exports = scope => `
    <html>
      <head>
        <link rel="icon" href="//www.iconsdb.com/icons/download/black/square-dashed-16.ico" type="image/x-icon" />
        ${scope.headContent}
      </head>
      <body style="margin:0">
        ${scope.bodyContent}
      </body>
    </html>
`;
