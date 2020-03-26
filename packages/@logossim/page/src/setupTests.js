/* eslint-disable max-classes-per-file */
import '@testing-library/jest-dom/extend-expect';

// Mocks `worker-loader`
jest.mock('../../core/Simulation/simulation.worker.js', () => ({
  __esModule: true,
  default: class SimulationWorker {},
}));

jest.mock('@logossim/core', () => ({
  ...jest.requireActual('@logossim/core'),
  SimulationEngine: class SimulationEngine {
    addCallback() {}

    removeCallback() {}

    start() {}

    pause() {}

    stop() {}

    getState() {}

    isRunning() {}

    isPaused() {}

    isStopped() {}
  },
}));
