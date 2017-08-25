#!/usr/bin/env node

const express = require('express');
const webpack = require("webpack");
const program = require('commander');
const pack = require('./package');

const customFs = require('./lib/fs');
const getWebpackConfig = require('./lib/get_webpack_config');

const { CUSTOM_PREVIEW_HEADER } = require('./config').paths;

const managerPageTemplate = require('./templates/manager_page.html');
const previewPageTemplate = require('./templates/preview_page.html');

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


function appMiddleware(req, res) {
  const stats = assetsByChunkName = res.locals.webpackStats.toJson();

  res.send(managerPageTemplate({
    assets: [`${stats.publicPath}${stats.assetsByChunkName.manager}`],
  }));
}

function previewMiddleware(req, res) {
  const stats = assetsByChunkName = res.locals.webpackStats.toJson();

  res.send(previewPageTemplate({
    assets: [`${stats.publicPath}${stats.assetsByChunkName.preview}`],
    header: res.header
  }));

}
