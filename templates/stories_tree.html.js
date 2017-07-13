module.exports = (scope) => `
  <ul>
  ${Object.keys(scope.stories).map((storyName) => `
    <li>
      <a href="#${storyName}">${storyName}</a>
      <ul>
      ${Object.keys(scope.stories[storyName]).map((subStoryName) => `
        <li>
          <a href="#${storyName}/${subStoryName}">${subStoryName}</a>
        </li>
      `).join('\n')}
      </ul>
    </li>
  `).join('\n')}
  </ul>
`;
