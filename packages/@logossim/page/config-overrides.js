const path = require('path');
const fs = require('fs');
const rewireBabelLoader = require('react-app-rewire-babel-loader');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath =>
  path.resolve(appDirectory, relativePath);

module.exports = function override(config) {
  config.module.rules.push({
    test: /simulation\.worker\.js$/,
    use: {
      loader: 'worker-loader',
      options: { name: 'SimulationWorker.[hash].js' },
    },
  });

  return rewireBabelLoader.include(config, [
    resolveApp('../core'),
    resolveApp('../components'),
  ]);
};
