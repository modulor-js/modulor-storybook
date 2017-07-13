module.exports = () => `

  <title>Stories manager</title>

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

    #preview-frame {
      display: block;
      width: 100%;
      height: 100%;
      border: none;
    }
    #stories-tree ul a {
      text-decoration: none;
      padding: 4px 0;
      display: block;
    }
    #stories-tree ul a:hover {
      background: #eee;
    }
    #stories-tree ul a:click {
      background: #ddd;
    }
    #stories-tree ul {
      list-style: none;
    }
    #stories-tree > ul {
      padding-left: 15px;
    }
    #stories-tree > ul > li {
      font-size: 1.2em;
      margin: 10px 0;
      border-bottom: 1px solid #ccc;
    }
    #stories-tree > ul > li li:last-child {
      border: 0;
    }
    #stories-tree > ul ul {
      padding: 0;
      margin-bottom: 0;
      padding-left: 5px;
    }
    #stories-tree > ul ul li {
      font-size: 0.8em;
      border-bottom: 1px solid #dedede;
    }
    #stories-tree > ul li li a {
      padding-left: 4px;
    }
  </style>
`
