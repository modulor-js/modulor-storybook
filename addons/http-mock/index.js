const AddonsApi = require('../../js/addons');

const fetchMock = require('fetch-mock');
const pathToRegexp = require('path-to-regexp');

const actions = require('./actions.js');

function prepareMiddleware(middleware, options){
  options = Object.assign({
    delay: 0
  }, options);
  const fn = typeof middleware === 'function' ? middleware : () => middleware;
  return (url, opts) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ body: fn(url, opts) })
      }, options.delay);
    });
  }
}

function withMock(config, render){
  return (story) => {

    AddonsApi.getChannel().on(actions.TRIGGER_DISABLE_MOCK, (value) => {
      if(value){
        fetchMock.restore();
      }
    });

    const paths = Object.keys(config).reduce((acc, path) => {
      [].concat(config[path]).forEach(middleware => {
        let mock, options;
        if(middleware.mock && middleware.options){
          mock = middleware.mock;
          options = middleware.options
        } else {
          mock = middleware;
          options = {};
        }

        fetchMock.mock(
          pathToRegexp(path),
          (url, opts) => {
            AddonsApi.getChannel().emit(actions.REQUEST_STARTED, {
              path
            });
            const prom = prepareMiddleware(mock, options)(url, opts);
            prom.then((response) => AddonsApi.getChannel().emit(actions.REQUEST_FINISHED, {
              path, response
            }));
            return prom;
          },
          options
        );
      });
      return Object.assign(acc, { [path]: true });
    }, {});

    AddonsApi.getChannel().emit(actions.UPDATE_ROUTES, Object.keys(paths));

    return (render || story)();
  }
}

module.exports = {
  withMock
}

