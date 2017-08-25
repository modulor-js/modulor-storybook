const { TARGET_DIR, PROJECT_DIR, TARGET_NODE_MODULES, PROJECT_NODE_MODULES } = require('../config').paths;

module.exports = {
  module: {
    rules: [],
  },
  resolve: {
    modules: [ TARGET_NODE_MODULES, PROJECT_NODE_MODULES ]
  },
};
