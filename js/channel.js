module.exports = class {
  constructor(target){
    this.target = target;
  }
  on(eventName, callback){
    window.addEventListener('message', (message) => {
      if(message.data.eventName === eventName){
        callback.call(this, message.data.eventData);
      }
    });
  }
  emit(eventName, eventData){
    this.target.postMessage({
      eventName: eventName,
      eventData: eventData
    }, '*');
  }
}
