const {
  paths: { TARGET_DIR, PROJECT_DIR, STORYBOOK_DIR, TARGET_NODE_MODULES, PROJECT_NODE_MODULES },
  stories: { storybookDir }
} = require('../config');

module.exports = {
  module: {
    rules: [],
  },
  resolve: {
    modules: [ TARGET_NODE_MODULES, PROJECT_NODE_MODULES ]
  },
  output: {
    path: `${STORYBOOK_DIR}/dist/`,
  },
};
