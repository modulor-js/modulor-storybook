const path = require('path');

const TARGET_DIR = process.cwd();
const PROJECT_DIR = __dirname;

const defaultStoriesConfig = {
  storybookDir: '.storybook',
  storiesMask: '**/*.story.js',
  ignore: 'node_modules/**/*',
  setupFile: 'additional.js',
  previewHeader: 'preview-header.html'
};

const customStoriesConfig = require(path.resolve(TARGET_DIR, 'package.json'))['storybook'] || {};

Object.keys(customStoriesConfig).forEach((key) => {
  !!defaultStoriesConfig[key] && console.log(
    `using custom setting ${key}: ${customStoriesConfig[key]}`
  );
});

const storiesConfig = Object.assign({}, defaultStoriesConfig, customStoriesConfig);


module.exports = {
  stories: storiesConfig,
  paths: {
    TARGET_DIR: TARGET_DIR,
    PROJECT_DIR: PROJECT_DIR,

    TARGET_NODE_MODULES: path.resolve(TARGET_DIR, 'node_modules'),
    PROJECT_NODE_MODULES: path.resolve(PROJECT_DIR, 'node_modules'),

    WEBPACK: path.resolve(TARGET_DIR, storiesConfig.storybookDir, 'webpack.config.js'),

    CUSTOM_PREVIEW_HEADER: path.resolve(TARGET_DIR, storiesConfig.storybookDir, storiesConfig.previewHeader),

    SETUP_FILE: path.resolve(TARGET_DIR, storiesConfig.storybookDir, storiesConfig.setupFile),
    MANAGER_APP: path.resolve(PROJECT_DIR, 'js/manager.js'),
    PREVIEW_APP: path.resolve(PROJECT_DIR, 'js/preview.js')
  }
}
