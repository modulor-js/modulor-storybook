#!/usr/bin/env node

const express = require('express');
const webpack = require('webpack');
const program = require('commander');
const pack = require('./package');

const customFs = require('./lib/fs');
const getWebpackConfig = require('./lib/get_webpack_config');

const { CUSTOM_PREVIEW_HEADER, MIDDLEWARES_FILE } = require('./config').paths;

const managerPageTemplate = require('./templates/manager_page.html');
const previewPageTemplate = require('./templates/preview_page.html');

const webpackMiddleware = require('webpack-dev-middleware');

const networkInterfaces = require('os').networkInterfaces();

const IP_ADDR = getIpAddr();


// read arguments
program
  .version(pack.version)
  .option('-p, --port <n>', 'Port')
  .parse(process.argv);


// settings
const PORT = program.port || 3000;


// app
const app = express();

Promise.all([
  customFs.readFile(CUSTOM_PREVIEW_HEADER),
  getWebpackConfig(),
  customFs.checkFile(MIDDLEWARES_FILE),
]).then(([header, webpackConfig, customMiddlewaresExist]) => {
  const compiler = webpack(webpackConfig);

  app.use(webpackMiddleware(compiler, {
    serverSideRender: true,
    stats: 'minimal',
  }));

  app.use((req, res, next) => {
    res.header = header || '';
    next();
  });

  app.get('/preview.html', previewMiddleware);

  if (customMiddlewaresExist) {
    try {
      const customMiddlewares = [].concat(require(MIDDLEWARES_FILE));
      customMiddlewares.forEach((middleware) => {
        app.use(...[].concat(middleware));
      });
      console.log(`Added custom middlewares from ${MIDDLEWARES_FILE}`);
    } catch (e) {
      console.error(
        `Couldn't load middlewares from file ${MIDDLEWARES_FILE}. Error: ${e}`,
      );
    }
  }

  app.use(appMiddleware);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}\nOpen http://localhost:${PORT}/ on browser`);
    console.log(`IP address ==> ${IP_ADDR}`);
  });
}).catch(console.log);

function getIpAddr() {
  let addr = null;

  Object.keys(networkInterfaces).forEach((dev) => {
    networkInterfaces[dev].filter((details) => {
      if (details.family === 'IPv4' && details.internal === false) {
        addr = details.address;
      }
    });
  });

  return addr;
}

function appMiddleware(req, res) {
  const stats = assetsByChunkName = res.locals.webpackStats.toJson();

  res.send(managerPageTemplate({
    assets: [].concat(stats.assetsByChunkName.manager).map(asset => `${stats.publicPath}${asset}`),
  }));
}

function previewMiddleware(req, res) {
  const stats = assetsByChunkName = res.locals.webpackStats.toJson();

  res.send(previewPageTemplate({
    assets: [].concat(stats.assetsByChunkName.preview).map(asset => `${stats.publicPath}${asset}`),
    header: res.header,
  }));
}
