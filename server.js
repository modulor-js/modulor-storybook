const express = require('express');
const webpack = require("webpack");
const program = require('commander');
const fileHound = require('filehound');
const path = require('path');
const fs = require('fs');
const pack = require('./package')

const commonTemplate = require('./templates/common.html');
const managerTemplate = require('./templates/manager.html');
const managerHeadTemplate = require('./templates/manager_head.html');
const previewTemplate = require('./templates/preview.html');

const webpackMiddleware = require("webpack-dev-middleware");


//read arguments
program
  .version(pack.version)
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

const readFile = file => {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if(err){
        resolve(false);
        return;
      }
      resolve(data.toString());
    });
  });
}
const checkFile = file => {
  return readFile(file).then((content) => content ? file : false)
}

Promise.all([
  stories,
  readFile(path.resolve(TARGET_DIR, '.storybook', 'preview-header.html')),
  checkFile(path.resolve(TARGET_DIR, '.storybook', 'additional.js'))
]).then(values => {
  const storyFiles = values[0];
  const header = values[1];
  const additional = values[2];

  const common = [].concat(additional || [], storyFiles);

  const webpackConfigPrepared = Object.assign({}, webpackConfig, {
    entry: {
      manager: common.concat(path.resolve(PROJECT_DIR, 'js/manager.js')),
      preview: common.concat(path.resolve(PROJECT_DIR, 'js/preview.js'))
    }
  });

  const compiler = webpack(webpackConfigPrepared);

  app.use(webpackMiddleware(compiler, { serverSideRender: true }));
  app.use((req, res, next) => {
    res.header = header || '';
    next();
  })
  app.get('/preview.html', previewMiddleware);
  app.use(appMiddleware);

  app.listen(PORT, () => {
    console.log('Target Dir: ', TARGET_DIR);
    console.log(`App listening on port ${PORT}\nOpen http://localhost:${PORT}/ on browser`);
  });

});


function normalizeAssets(assets) {
  return [].concat(assets || []);
}

function appMiddleware(req, res) {
  const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;

  res.send(commonTemplate({
    headContent: managerHeadTemplate(),
    bodyContent: managerTemplate({
      assets: normalizeAssets(assetsByChunkName.manager)
    })
  }));
}

function previewMiddleware(req, res) {
  const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;

  res.send(commonTemplate({
    headContent: `
      <title>Story preview</title>
      ${res.header}
    `,
    bodyContent: previewTemplate({
      assets: normalizeAssets(assetsByChunkName.preview)
    })
  }));
}

