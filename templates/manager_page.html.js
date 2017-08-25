const commonTemplate = require('./common.html');
const managerTemplate = require('./manager.html');
const managerHeadTemplate = require('./manager_head.html');

module.exports = (scope) => commonTemplate({
  headContent: managerHeadTemplate(),
  bodyContent: managerTemplate({
    assets: scope.assets
  })
})
