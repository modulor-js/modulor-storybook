module.exports = (scope) => `
  <ul>
  ${Object.keys(scope.stories).map((storyName) => `
    <li>
      <a href="#${storyName}">${storyName}</a>
      <ul>
      ${Object.keys(scope.stories[storyName].getStories()).map((subStoryName) => `
        <li>
          <a href="#${storyName}/${subStoryName}">${subStoryName}</a>
        </li>
      `).join('')}
      </ul>
    </li>
  `).join('')}
  </ul>
`;
