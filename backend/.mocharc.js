// backend/.mocharc.js
module.exports = {
  timeout: 10000,
  exit: true,
  ignore: ['node_modules'],
  reporter: 'spec',
  recursive: true,
  colors: true
};