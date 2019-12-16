const path = require('path');
const fs = require('fs');
const rewireBabelLoader = require('react-app-rewire-babel-loader');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath =>
  path.resolve(appDirectory, relativePath);

module.exports = function override(config) {
  return rewireBabelLoader.include(config, [
    resolveApp('../core'),
    resolveApp('../components'),
  ]);
};
