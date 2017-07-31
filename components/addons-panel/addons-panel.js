const { delegate } = require('ascesis/delegate');
const { fireEvent } = require('ascesis');
const addonsPanelTemplate = require('./addons-panel.html');

class AddonsPanel extends HTMLElement {
  connectedCallback(){
    delegate.on('change', this, 'input[panel]', (event, target) => {
      fireEvent('addon-changed', this, { addon: target.getAttribute('panel') });
    });
  }
  setActive(panel){
    (this.querySelector(`input[panel = "${panel}"]`) || {}).checked = true;
  }
  render(panels){
    this.innerHTML = addonsPanelTemplate({ panels });
  }

  get state(){
    return this._state;
  }

  set state(value){
    this._state = value;
    this.render(value);
  }
}

customElements.define('sandbox-addons-panel', AddonsPanel);
