class AddonsApi {
  constructor(){
    this.channel = {
      on(){
        console.log(`Can't subscribe on channel event. Channel is not ready yet`);
      },
      emit(){
        console.log(`Can't emit channel event. Channel is not ready yet`);
      }
    };
    this.panels = {};
    this.onStoryListeners = [];
  }

  getChannel() {
    return this.channel;
  }

  setChannel(channel) {
    this.channel = channel;
  }

  addPanel(name, render){
    this.panels[name] = { render };
  }

  getPanels(){
    return this.panels;
  }

  onStory(handler){
    this.onStoryListeners.push(handler);
  }

  notifyOnStoryListeners(story, storyKind){
    this.onStoryListeners.forEach((listener) => listener(story, storyKind));
  }
}

module.exports = new AddonsApi();

