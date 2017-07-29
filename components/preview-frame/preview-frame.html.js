module.exports = (scope) => `

  <style>
    #preview-frame {
      display: block;
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>

  <a id="fullscreen-anchor" class="fullscreen-icon" href="" target="_blank">
    <span class="arrows-overlap"></span>
  </a>
  <iframe name="preview-frame" id="preview-frame" src=""></iframe>
`;
