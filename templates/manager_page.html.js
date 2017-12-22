const commonTemplate = require('./common.html');
const managerTemplate = require('./manager.html');
const managerHeadTemplate = require('./manager_head.html');

module.exports = scope => commonTemplate({
  branding: scope.branding,
  headContent: managerHeadTemplate({ branding: scope.branding }),
  bodyContent: managerTemplate({
    branding: scope.branding,
    assets: scope.assets,
  }),
});
