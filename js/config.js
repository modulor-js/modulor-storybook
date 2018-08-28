let config = {
  width: 80,
  height: 75,
};

module.exports = {
  getDefaultParams(){
    return config;
  },

  setDefaultParams(params){
    return Object.assign(config, params);
  }
}

