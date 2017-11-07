const AddonsApi = require("modulor-storybook/addons");

const htmlBeautify = require('js-beautify').html_beautify;


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

      const str = encode(htmlBeautify(storyObject.render(), {
        //options are listed in beautifier's source code
        wrap_line_length: 50,
        indent_size: 2,
      }));

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
