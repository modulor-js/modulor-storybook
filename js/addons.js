class AddonsApi {
  constructor(){
    this.channel = { on() {}, emit() {} };
  }

  getChannel() {
    return this.channel;
  }

  setChannel(channel) {
    this.channel = channel;
  }

  addPanel(){
  }
}

module.exports = new AddonsApi();

