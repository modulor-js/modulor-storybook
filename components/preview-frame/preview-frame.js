const template = require('./preview-frame.html');

class PreviewFrame extends HTMLElement {
  connectedCallback() {
  }
  getWindow() {
    return this.$previewFrame.contentWindow;
  }
  setActive(story, storyKind) {
    const url = `${this.urlBase}preview.html?story=${story}&storyKind=${storyKind}`;

    this.getWindow().location.replace(url);

    this.$fullscreenAnchor.href = url;
  }

  get urlBase() {
    return this.getAttribute('url-base') || '/';
  }

  render() {
    this.innerHTML = template();
    this.$previewFrame = this.querySelector('#preview-frame');
    this.$fullscreenAnchor = this.querySelector('#fullscreen-anchor');
  }
}

customElements.define('preview-frame', PreviewFrame);
