const express = require('express');
const webpack = require("webpack");
const program = require('commander');
const fileHound = require('filehound');
const path = require('path');
const fs = require('fs');

const webpackMiddleware = require("webpack-dev-middleware");


//read arguments
program
  .version('0.1.0')
  .option('-p, --port <n>', 'Port')
  .parse(process.argv);


//settings
const PORT = program.port || 3000;
const TARGET_DIR = process.cwd();
const PROJECT_DIR = __dirname;


let projectConfig = {};
try {
  projectConfig = require(path.resolve(TARGET_DIR, '.storybook', 'config.js'));
} catch(e) {
}

const config = Object.assign({}, require('./defaults/config.js'), projectConfig);


let webpackConfig = {};
try {
  webpackConfig = require(path.resolve(TARGET_DIR, '.storybook', 'webpack.config.js'));
} catch(e) {
  console.log('using default webpack config');
  webpackConfig = require('./defaults/webpack.config.js');
}


//app
const app = express();

const stories = fileHound.create()
  .paths(TARGET_DIR)
  .match(config.storiesMask)
  .find();



stories.then((storyFiles) => {

  const webpackConfigPrepared = Object.assign({}, webpackConfig, {
    entry: {
      application: storyFiles.concat(path.resolve(PROJECT_DIR, 'js/manager.js'))
    }
  });

  const compiler = webpack(webpackConfigPrepared);

  app.use(webpackMiddleware(compiler, { serverSideRender: true }));
  app.use(appMiddleware);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

  //process.exit(0);
});


function normalizeAssets(assets) {
  return [].concat(assets || []);
}

function appMiddleware(req, res) {
  const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName

  // then use `assetsByChunkName` for server-sider rendering
  // For example, if you have only one main chunk:

  res.send(`
    <html>
      <head>
        <title>My App</title>
                    ${
                            normalizeAssets(assetsByChunkName.application)
                            .filter(path => path.endsWith('.css'))
                            .map(path => `<link rel="stylesheet" href="${path}" />`)
                            .join('\n')
                    }
      </head>
      <body>
        <div id="root"></div>
                    ${
                            normalizeAssets(assetsByChunkName.application)
                            .filter(path => path.endsWith('.js'))
                            .map(path => `<script src="${path}"></script>`)
                            .join('\n')
                    }
      </body>
    </html>
  `);
}

