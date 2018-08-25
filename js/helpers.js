const html = (content) => (container) => container.innerHTML = content;

const wrapStory = (story) => typeof story === 'function' ? story : html(story);

const safeRender = (container, story) => wrapStory(story)(container);


module.exports = {
  html: html,
  wrapStory: wrapStory,
  safeRender: safeRender
};

