const AddonsApi = require("modulor-storybook/addons");

const beautifier = require('js-beautify');
const htmlBeautify = beautifier.html_beautify;
const jsBeautify = beautifier.js_beautify;


const encode = (s) => s.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;');

const loadDependency = (src) => new Promise((resolve) => {
  const $script = document.createElement('script');
  $script.src = src;
  document.head.appendChild($script);

  $script.addEventListener('load', (event) => resolve(event.target));
});

const HIGHLIGHTER_SRC = 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js?autorun=false';


class UsagePlugin extends HTMLElement {
  connectedCallback() {

    const highlighterReady = loadDependency(HIGHLIGHTER_SRC).then(() => window.PR);

    AddonsApi.onStory((story, storyKind) => {
      const storyObject = AddonsApi.getStory(story, storyKind);

      const storyContent = storyObject.render();

      const beautifiedStoryContent = typeof storyContent === 'function'
        ? jsBeautify(storyObject.render.toString(), {
          indent_size: 2,
        })
        : htmlBeautify(storyContent, {
          wrap_line_length: 50,
          indent_size: 2,
        });

      const str = encode(beautifiedStoryContent);

      this.innerHTML = `
        <pre class="prettyprint"
             style="border:none; margin: 0; padding: 0;">${str}</pre>
      `;

      highlighterReady.then((highlighter) => highlighter.prettyPrint(() => {}, this));

    });
  }
}

customElements.define( "usage-plugin", UsagePlugin);

AddonsApi.addPanel("Usage", () => `<usage-plugin></usage-plugin>`);
