module.exports = (() => {
  let stories = {};

  function _storiesOf(name){
    this.storyName = name;
    this.stories = {};
    this.decorators = [];
  };

  _storiesOf.prototype.add = function(name, fn){
    this.stories[name] = {
      render: fn
    };
    return this;
  };

  _storiesOf.prototype.addDecorator = function(fn){
    this.decorators.push(fn);
    return this;
  };

  _storiesOf.prototype.getStories = function(fn){
    return this.stories;
  };

  _storiesOf.prototype.getStory = function(name){
    return this.stories[name];
  };

  _storiesOf.prototype.renderStory = function(name){
    return this.decorators.reduce((acc, decorator) => {
      return () => {
        return decorator.apply(null, [].concat(acc, Array.prototype.slice.call(arguments)));
      };
    }, this.stories[name].render)();
  };

  function storiesOf(name){
    const storiesOf = new _storiesOf(name);
    stories[name] = storiesOf;
    return storiesOf;
  }

  function getStories(){
    return stories;
  }

  return {
    storiesOf, getStories
  }

})();

