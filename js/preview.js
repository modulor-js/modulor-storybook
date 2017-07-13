const { Delegate } = require('ascesis/delegate');
const { Router } = require('ascesis/router');
const { getStories } = require('./story');

const stories = getStories();

module.exports = () => {
  console.log('preview app init', stories);
};
