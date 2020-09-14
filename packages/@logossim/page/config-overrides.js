/* eslint-disable no-param-reassign */
const rewireBabelLoader = require('react-app-rewire-babel-loader');

const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath =>
  path.resolve(appDirectory, relativePath);

module.exports = {
  webpack: config => {
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
  },
  jest: config => {
    config.rootDir = resolveApp('..');
    config.testMatch = [
      '<rootDir>/page/src/**/__tests__/**/*.test.{js,jsx}',
      '<rootDir>/components/**/__tests__/**/*.test.{js,jsx}',
    ];
    config.collectCoverageFrom = ['**/*.{js,jsx}'];
    config.coverageDirectory = resolveApp('../../../coverage');
    config.setupFilesAfterEnv = ['<rootDir>/page/src/setupTests.js'];
    config.roots = ['<rootDir>/page/src', '<rootDir>/components'];
    return config;
  },
};
