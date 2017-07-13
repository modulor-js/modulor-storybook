module.exports = (scope) => `
  <div class="split split-horizontal left-panel">
    <div id="stories-tree" class="split content"></div>
  </div>
  <div class="split split-horizontal right-panel">
    <div id="preview-block" class="split content">
      <iframe id="preview-frame" src="/preview.html"></iframe>
    </div>
    <div id="info-block" class="split content"></div>
  </div>

  ${scope.assets.filter(path => path.endsWith('.js'))
                .map(path => `<script src="${path}"></script>`)
                .join('\n')
  }
`;
