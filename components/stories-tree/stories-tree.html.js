module.exports = scope => `
  <style>
    stories-tree ul a {
      text-decoration: none;
      padding: 4px 0;
      display: block;
    }
    stories-tree ul a:hover {
      background: #eee;
    }
    stories-tree ul a:click {
      background: #ddd;
    }
    stories-tree ul {
      list-style: none;
    }
    stories-tree > ul {
      padding-left: 15px;
    }
    stories-tree > ul > li {
      font-size: 1.2em;
      margin: 10px 0;
      border-bottom: 1px solid #ccc;
    }
    stories-tree > ul > li li:last-child {
      border: 0;
    }
    stories-tree > ul ul {
      padding: 0;
      margin-bottom: 0;
      padding-left: 5px;
    }
    stories-tree > ul ul li {
      font-size: 0.8em;
      border-bottom: 1px solid #dedede;
    }
    stories-tree > ul li li a {
      padding-left: 4px;
    }

    stories-tree input[type="radio"] {
      display: none;
    }

    stories-tree input[name="story"]:not(:checked) + ul {
      display: none;
    }

    stories-tree input[name="storyKind"]:checked + a {
      background: #eee;
    }

    stories-tree .hide-story {
      display: none;
    }

    stories-tree .filter-input {
      box-shadow: 0 0 1em 0 #b8b8b8;
      border: none;
      font-size: 14px;
      padding: 0.5em 1em;
      position: sticky;
      top: 0;
      width: 100%;
    }
  </style>

  <input class="filter-input" type="textbox" ref="filter-input" placeholder="${scope.placeholder}">

  <ul ref="story-list">
  ${Object.keys(scope.stories).map((story, index) => `
    <li story="${story}">
      <label for="story-${index}">
        <a>${story}</a>
      </label>
      <input type="radio" name="story" story="${story}" id="story-${index}"/>
      <ul>
      ${Object.keys(scope.stories[story].getStories()).map(storyKind => `
        <li story-kind="${storyKind}">
          <label>
            <input story-kind="${storyKind}" name="storyKind" type="radio"/>
            <a>${storyKind}</a>
          </label>
        </li>
      `).join('')}
      </ul>
    </li>
  `).join('')}
  </ul>
`;
