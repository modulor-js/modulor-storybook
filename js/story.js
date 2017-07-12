let stories = {};
module.exports = {
  add(name){
    stories[name] = true;
  },
  getStories(){
    return Object.keys(stories)
  }
}
