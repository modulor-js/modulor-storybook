module.exports = (() => {
  let stories = {};

  function generateChain(stories){
    const chain = {
      add(name, fn){
        stories[name] = fn;
        return this;
      },
      addDecorator(){
        return this;
      },

      //should be defined by plugins
      info(){
        return this;
      }
    }
    return chain;
  }

  function storyOf(name){
    return generateChain(stories[name] || (stories[name] = {}));
  }

  function getStories(){
    return stories;
  }

  return {
    storyOf, getStories
  }

})();

