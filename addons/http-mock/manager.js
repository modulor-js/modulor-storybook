const AddonsApi = require('../../js/addons');
const Delegate = require('modulor/delegate');

const actions = require('./actions.js');

customElements.define('http-mock-manager', class extends HTMLElement {
  connectedCallback(){

    AddonsApi.getChannel().on(actions.UPDATE_ROUTES, (paths) => {
      this.innerHTML = `
        <label class="disable-mock-checkbox">
          <input type="checkbox"/>
          disable mock
        </label>
        <div ref="$requestsBadgesWrapper">
          <style>
            .request-badge {
              background-color: white;
              border-radius: 5px;
              border: 1px solid #219BC6;
              color: #219BC6;
              display: inline-block;
              font-family: "Open Sans", sans-serif;
              font-size: 12px;
              font-weight: 700;
              height: 30px;
              line-height: 30px;
              margin-right: 5px;
              padding-left: 20px;
              padding-right: 20px;
              transition: all 250ms;
            }
            .request-badge.started {
              background-color: #FFEB3B;
              transition: all 300ms ease;
            }
            .request-badge.finished {
              background-color: #CDDC39;
              transition: all 300ms ease;
            }
            .disable-mock-checkbox {
              padding: 0 0 1em;
              display: inline-block;
              cursor: pointer;
            }
          </style>
          ${paths.map(path => `
            <span class="request-badge" data-path="${path}">${path}</span>
          `).join('')}
        </div>
      `;
    });

    Delegate.delegate.on('change', this, 'input', (event, target) => {
      AddonsApi.getChannel().emit(actions.TRIGGER_DISABLE_MOCK, target.checked);
    });

    AddonsApi.getChannel().on(actions.REQUEST_STARTED, (request) => {
      this.querySelector(`[data-path="${request.path}"]`).classList.add('started');
    });

    AddonsApi.getChannel().on(actions.REQUEST_FINISHED, (request) => {
      this.querySelector(`[data-path="${request.path}"]`).classList.remove('started');
      this.querySelector(`[data-path="${request.path}"]`).classList.add('finished');
      setTimeout(() => {
        this.querySelector(`[data-path="${request.path}"]`).classList.remove('finished');
      }, 600);
    });

    AddonsApi.onStory((story, storyKind) => {
      this.innerHTML = '';
    });
  }
});

AddonsApi.addPanel('Mocks', () => `<http-mock-manager></http-mock-manager>`);
