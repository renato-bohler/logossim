/* eslint-disable no-param-reassign */
const rewireBabelLoader = require('react-app-rewire-babel-loader');

const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath =>
  path.resolve(appDirectory, relativePath);

module.exports = {
  webpack: config => {
    /**
     * The `core` and `components` packages from logossim has to be
     * handled by `babel-loader` when building.
     */
    config = rewireBabelLoader.include(config, [
      resolveApp('../core'),
      resolveApp('../components'),
    ]);

    const { oneOf } = config.module.rules[
      config.module.rules.length - 1
    ];

    /**
     * The `simulation.worker.js` file has to be loaded by
     * `worker-loader` in order to be executed on a Web Worker thread.
     */
    oneOf.unshift({
      test: /simulation\.worker\.js$/,
      use: {
        loader: 'worker-loader',
        options: { name: 'SimulationWorker.[hash].js' },
      },
    });

    /**
     * Custom babel-loader settings for component model files.
     *
     * This is needed because some of the default Babel
     * transformations that react-script performs ends up breaking the
     * serialization/deserialization process.
     */
    oneOf.unshift({
      test: /.*components\/(.*)\/\1Model.js/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/plugin-proposal-numeric-separator'],
        },
      },
    });

    return config;
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
