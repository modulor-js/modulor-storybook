module.exports = scope => `
  <style>
    ${scope.name} {
      display: block;
      border-bottom: 1px solid #c0c0c0;
      background: #efefef;
      position: relative;
    }
    .branding-container {
      padding: 6px 5px 8px;
      font-size: 2em;
    }
    .actions {
      position: absolute;
      top: 100%;
      width: 100%;
      background: #fff;
      overflow: hidden;
      height: 300px;
      transition: height linear 200ms;
    }
    .actions.hidden {
      display: block;
      height: 0;
    }
    .actions button,
    .actions input {
      border: 1px solid #ccc;
      border-collapse: collapse;
      background: #dedede;
      font-size: 14px;
      padding: 5px 7px;
      display: block;
      width: 100%;
      text-align: left;
    }
    .actions:before,
    .actions:after {
      content: ' ';
      display: table;
      width: 100%;
    }
    .toggle {
      padding: 6px;
      font-size: 14px;
      line-height: 1;
      background: 0 0;
      border: 1px solid rgba(0,0,0, 0.5);
      border-radius: .25rem;
      text-transform: none;
      margin: 0;
      color: rgba(0,0,0,.5);
      vertical-align: top;
      float: right;
    }
    .toggle:after {
      display: inline-block;
      width: 1.5em;
      height: 1.5em;
      vertical-align: middle;
      content: "";
      background: no-repeat center center;
      background-size: 100% 100%;
      background-image: url("data:image/svg+xml;charset=utf8,<svg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'><path stroke='rgba(0, 0, 0, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/></svg>");
    }
  </style>
  <div class="branding-container">
    <button type="button" ref="toggle" class="toggle"></button>
    ${scope.brand}
  </div>
  <div class="actions hidden">
    <div>
      <button type="button" title="Mobile" ref="mobile">Toggle Mobile</button>
      <button type="button" title="Tree" ref="tree">Toggle Tree</button>
      <button type="button" title="Addon" ref="addon">Toggle Addon</button>
    </div>
    <div>
      <button type="button" title="Filter" ref="filter">Toggle Filter</button>
      <div ref="filterForm" class="hidden">
        <input type="text" ref="filterQuery" placeholder="Filter Query" />
        <button type="button" title="Apply Filter" ref="filterApply">Apply Filter</button>
        <button type="button" title="Clear Filter" ref="filterClear">Clear Filter</button>
        <button type="button" title="Close Filter" ref="filterClose">Close Filter</button>
      </div>
      <button type="button" title="Sort" ref="sort">Sort</button>
    </div>
  </div>
`;
