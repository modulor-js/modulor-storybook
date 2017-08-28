const fs = require('fs');
const customFs = require('./fs');
const glob = require('glob-promise');
const path = require('path');
const merge = require('deepmerge');
const assert = require('assert');

const {
  paths: {
    CUSTOM_WEBPACK_CONFIG,
    DEFAULT_WEBPACK_CONFIG,
    TARGET_DIR,
    PROJECT_DIR,
    MANAGER_APP,
    PREVIEW_APP
  },
  stories: config
} = require('../config');


const getWebpackConfig = () => customFs.checkFile(CUSTOM_WEBPACK_CONFIG).then((exists) => {
  !exists && console.log(`${CUSTOM_WEBPACK_CONFIG} does'n exist. Using default config`);
  return merge(
    require(DEFAULT_WEBPACK_CONFIG),
    exists ? require(CUSTOM_WEBPACK_CONFIG) : {}
  );
});

const getStories = () => glob(config.storiesMask, {
  ignore: config.ignore
});


module.exports = () => Promise.all([
  getStories(),
  customFs.checkFile(path.resolve(TARGET_DIR, config.storybookDir, config.setupFile)),
  getWebpackConfig(),
]).then(([stories, additional, webpackConfig]) => {

  const storyFiles = stories.map(file => path.resolve(TARGET_DIR, path.resolve(TARGET_DIR, file)));

  console.log('Target Dir: ', TARGET_DIR);
  console.log(`Found ${storyFiles.length} Stories`);

  const common = [].concat(additional || [], storyFiles);

  const webpackConfigPrepared = Object.assign({}, webpackConfig, {
    entry: {
      manager: common.concat(MANAGER_APP),
      preview: common.concat(PREVIEW_APP)
    }
  });

  return webpackConfigPrepared;
});
