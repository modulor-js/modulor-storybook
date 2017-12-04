module.exports = scope => `
  <title>${scope.branding.name}</title>
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
    body.mobile {
      padding: 0;
    }
    .hidden {
      display: none;
    }
    .split {
      -webkit-box-sizing: border-box;
         -moz-box-sizing: border-box;
              box-sizing: border-box;

      overflow-y: auto;
      overflow-x: hidden;
    }

    .content {
      border: 1px solid #C0C0C0;
      box-shadow: inset 0 1px 2px #e4e4e4;
      background-color: #fff;
      display: block;
      height: 100%;
      width: 100%;
    }
    .gutter {
      background-color: transparent;

      background-repeat: no-repeat;
      background-position: 50%;
    }
    .gutter.gutter-horizontal {
      cursor: col-resize;
    }
    .gutter.gutter-vertical {
      cursor: row-resize;
    }
    .split.split-horizontal, .gutter.gutter-horizontal {
      height: 100%;
      float: left;
    }
  </style>
`;
