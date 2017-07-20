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
}

module.exports = new AddonsApi();

