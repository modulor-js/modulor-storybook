#!/usr/bin/env node

const express = require('express');
const webpack = require("webpack");
const program = require('commander');
const pack = require('./package');

const customFs = require('./lib/fs');
const { CUSTOM_PREVIEW_HEADER } = require('./config').paths;

const getWebpackConfig = require('./lib/get_webpack_config');

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


//app
const app = express();

Promise.all([
  customFs.readFile(CUSTOM_PREVIEW_HEADER),
  getWebpackConfig()
]).then(([header, webpackConfig]) => {
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {
    serverSideRender: true,
    stats: 'minimal'
  }));
  app.use((req, res, next) => {
    res.header = header || '';
    next();
  });
  app.get('/preview.html', previewMiddleware);
  app.use(appMiddleware);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}\nOpen http://localhost:${PORT}/ on browser`);
  });
}).catch(console.log);


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
