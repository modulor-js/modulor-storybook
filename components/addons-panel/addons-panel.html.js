module.exports = (scope) => `
  <style>
    sandbox-addons-panel {
      position: relative;
    }
    .panels-header {
      height: 25px;
      border-bottom: 1px solid #e4e4e4;
    }
    .addons-panel-tab {
      display : none;
    }
    .addons-panel-label {
      color: rgb(68, 68, 68);
      opacity: 0.5;
      display: inline-block;
      font-size: 14px;
      font-weight: 300;
      padding: 4px 10px;
      cursor: pointer;
    }
    .addons-panel-tab:not(:checked) ~ .addons-panel-content {
      display : none;
    }
    .addons-panel-tab:checked + .addons-panel-label {
      opacity: 1;
    }
    .addons-panel-content {
      position: absolute;
      width: calc(100% - 20px);
      height: calc(100% - 45px);
      top: 25px;
      padding: 10px 10px;
      overflow: scroll;
    }
  </style>

  <div class="panels-header">
    ${Object.keys(scope.panels).map((key, index) => `
      <label>
        <input panel="${key}" name="addons-panel-tab" class="addons-panel-tab" type="radio" ${!index ? 'checked': ''}>
        <span class="addons-panel-label">${key}</span>
        <div class="addons-panel-content" data-index=${index}>
          ${scope.panels[key].render()}
        </div>
      </label>
    `).join('')}
  </div>
`;

