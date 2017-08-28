#!/usr/bin/env node

const webpack = require("webpack");
const program = require('commander');
const pack = require('./package');
const path = require('path');

const customFs = require('./lib/fs');
const { CUSTOM_PREVIEW_HEADER } = require('./config').paths;

const getWebpackConfig = require('./lib/get_webpack_config');

const managerPageTemplate = require('./templates/manager_page.html');
const previewPageTemplate = require('./templates/preview_page.html');


//read arguments
program
  .version(pack.version)
  .parse(process.argv);


//build
Promise.all([
  customFs.readFile(CUSTOM_PREVIEW_HEADER),
  getWebpackConfig()
]).then(([header, webpackConfig]) => {

  const BUILD_DIR = webpackConfig.output.path;

  console.log(`Building static storybook into ${BUILD_DIR}`);

  const compiler = webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    console.log(stats.toString("normal"));

    const statsJson = stats.toJson();

    customFs.saveFile(path.resolve(BUILD_DIR, 'index.html'), managerPageTemplate({
      assets: [`${statsJson.publicPath}${statsJson.assetsByChunkName.manager}`],
    }));

    customFs.saveFile(path.resolve(BUILD_DIR, 'preview.html'), previewPageTemplate({
      assets: [`${statsJson.publicPath}${statsJson.assetsByChunkName.preview}`],
      header: header
    }));

  });
}).catch(console.log);

