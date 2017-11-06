const path = require('path');

const TARGET_DIR = process.cwd();
const PROJECT_DIR = __dirname;

const defaultStoriesConfig = {
  branding: {
    name: 'Storybook',
    icon: {
      type: 'image/x-icon',
      url: '//www.iconsdb.com/icons/download/black/square-dashed-16.ico',
    },
    logo: false,
  },
  storybookDir: '.storybook',
  webpackConfig: 'webpack.config.js',
  storiesMask: '**/*.story.js',
  ignore: 'node_modules/**/*',
  setupFile: 'additional.js',
  previewHeader: 'preview-header.html',
  middlewaresFile: 'middlewares.js',
};

const customStoriesConfig = require(path.resolve(TARGET_DIR, 'package.json'))['storybook'] || {};

Object.keys(customStoriesConfig).forEach((key) => {
  !!defaultStoriesConfig[key] && console.log(
    `using custom setting ${key}: ${customStoriesConfig[key]}`
  );
});

const storiesConfig = Object.assign({}, defaultStoriesConfig, customStoriesConfig);

const STORYBOOK_DIR = path.resolve(TARGET_DIR, storiesConfig.storybookDir);

module.exports = {
  stories: storiesConfig,
  paths: {
    TARGET_DIR: TARGET_DIR,
    PROJECT_DIR: PROJECT_DIR,
    STORYBOOK_DIR: STORYBOOK_DIR,

    TARGET_NODE_MODULES: path.resolve(TARGET_DIR, 'node_modules'),
    PROJECT_NODE_MODULES: path.resolve(PROJECT_DIR, 'node_modules'),

    CUSTOM_WEBPACK_CONFIG: path.resolve(TARGET_DIR, storiesConfig.storybookDir, storiesConfig.webpackConfig),
    DEFAULT_WEBPACK_CONFIG: path.resolve(PROJECT_DIR, 'defaults/webpack.config.js'),

    CUSTOM_PREVIEW_HEADER: path.resolve(TARGET_DIR, storiesConfig.storybookDir, storiesConfig.previewHeader),

    SETUP_FILE: path.resolve(TARGET_DIR, storiesConfig.storybookDir, storiesConfig.setupFile),
    MIDDLEWARES_FILE: path.resolve(TARGET_DIR, storiesConfig.storybookDir, storiesConfig.middlewaresFile),

    MANAGER_APP: path.resolve(PROJECT_DIR, 'js/manager.js'),
    PREVIEW_APP: path.resolve(PROJECT_DIR, 'js/preview.js'),
  }
}
