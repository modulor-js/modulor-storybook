#!/usr/bin/env node

const webpack = require('webpack');
const program = require('commander');
const pack = require('./package');
const path = require('path');
const fs = require('fs');

const customFs = require('./lib/fs');
const { CUSTOM_PREVIEW_HEADER, FAVICON_FILE, FALLBACK_FAVICON_FILE } = require('./config').paths;

const getWebpackConfig = require('./lib/get_webpack_config');

const managerPageTemplate = require('./templates/manager_page.html');
const previewPageTemplate = require('./templates/preview_page.html');

const parseOutputPath = dir => path.resolve(process.cwd(), dir);

// read arguments
program
  .version(pack.version)
  .option('-o, --output <dir>', 'Output Path', parseOutputPath)
  .parse(process.argv);


// build
Promise.all([
  customFs.readFile(CUSTOM_PREVIEW_HEADER),
  getWebpackConfig(),
  customFs.checkFile(FAVICON_FILE),
]).then(([header, webpackConfig, faviconFileExists]) => {
  if (program.output) {
    if (!fs.existsSync(program.output)) {
      // Make output Directory
      fs.mkdirSync(program.output);
    }
    webpackConfig.output.path = program.output;
  }
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

    console.log(stats.toString('normal'));

    const statsJson = stats.toJson();

    customFs.saveFile(path.resolve(BUILD_DIR, 'index.html'), managerPageTemplate({
      assets: [].concat(statsJson.assetsByChunkName.manager).map(asset => `${statsJson.publicPath}${asset}`),
    }));

    customFs.saveFile(path.resolve(BUILD_DIR, 'preview.html'), previewPageTemplate({
      header: header,
      assets: [].concat(statsJson.assetsByChunkName.preview).map(asset => `${statsJson.publicPath}${asset}`),
    }));

    customFs.copyFile(
      faviconFileExists ? FAVICON_FILE : FALLBACK_FAVICON_FILE,
      path.resolve(BUILD_DIR, 'favicon.ico')
    );

  });
}).catch(console.log);

