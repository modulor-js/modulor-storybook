const config = {
  width: 80,
  height: 75,
};

module.exports = {
  getDefaultParams(){
    return Object.assign({}, config);
  },

  setDefaultParams(params){
    return Object.assign(config, params);
  }
}

