const fs = require('fs');

const readFile = file => {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if(err){
        resolve(false);
        return;
      }
      resolve(data.toString());
    });
  });
}

const checkFile = file => {
  return readFile(file).then((content) => content ? file : false)
}


module.exports = { readFile, checkFile }
