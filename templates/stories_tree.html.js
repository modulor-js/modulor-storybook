module.exports = (scope) => `
  <ul>
  ${Object.keys(scope.stories).map((storyName) => `
    <li>
      ${storyName}
      <ul>
      ${Object.keys(scope.stories[storyName]).map((subStoryName) => `
        <li>${subStoryName}</li>
      `).join('\n')}
      </ul>
    </li>
  `).join('\n')}
  </ul>
`;
